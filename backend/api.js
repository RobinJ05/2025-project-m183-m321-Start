// importing genereal modules

//load environment
require("dotenv").config();

// cookie parser for handling cookies
const cookieParser = require('cookie-parser');

// security middleware
const helmet = require('helmet');

// module for handling http requests and responses and managing routes
const express = require("express");

// helper for concatinating paths
const path = require("path");

// session management
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

// passport configuration
const passport = require('passport');
const initializePassport = require('./config/passport-config');

// importing self-developed moudules
const routes = require("./routes/main");

// importing log utilities
const logger = require("./util/log");

// import model classes
const Mountain = require("./models/mountain");
const User = require("./models/user");
const { checkAndChangePlaintextPasswords } = require('./controllers/user');

// get constants
const { STATIC_DIR, JWTSECTRET, USE_SESSION_HANDLING } = require("./util/const");

// import keycloak configuration
const { keycloak } = require('./config/keycloak-config');

const api = express();

// Use helmet middleware for security headers with explicit X-Frame-Options configuration
api.use(helmet({
  frameguard: { action: 'DENY' } // Set X-Frame-Options to DENY to prevent clickjacking
}));

api.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// initialize body-parser for JSON-format
api.use(express.json());

// Configure authentication middleware based on the selected method
if (USE_SESSION_HANDLING) {
  // Use Passport/Session authentication
  api.use(session({
    cookie: { maxAge: 3600000 }, // 1 hour
    store: new MemoryStore({
      checkPeriod: 3600000 // prune expired entries every 1h
    }),
    resave: false,
    saveUninitialized: false,
    secret: JWTSECTRET // In production, use environment variable
  }));

  // initialize cookie-parser middleware
  api.use(cookieParser());

  // Initialize Passport and restore authentication state from session
  initializePassport(passport);
  api.use(passport.initialize());
  api.use(passport.session());

  // configure cookie settings
  api.use((req, res, next) => {
    res.cookie('username', 'guest', {
      httpOnly: true,
      secure: false,
      maxAge: 3600000 // 1 hour in milliseconds
    });
    next();
  });
} else {
  api.use(session({
    //secret: found in keycloak.json
    secret: 'UtJ5COTGF9h9TWSTVUW5VHLhTCFiHPRy',
    resave: false,
    saveUninitialized: true
  }));
  api.use(keycloak.middleware());
}


// initialize database connection an orm
const db = require("./util/db");

const { sleep } = require("./util/helper");

// get sample data
const sampledata = require("./util/sampledata");
const { env } = require("process");

// Setting response header to allow cross origin requests
// CORS-Settings.
api.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Expose-Headers", "*");

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// set static path for public dirctory: cwd=current working directory
api.use(express.static(path.join(process.cwd(), STATIC_DIR)));

api.use(routes);

// error handler sends error message as json
api.use((err, req, res, next) => {
  logger.error(err.message, {
    errno: err.errno,
    error: err,
  });
  const status = err.statusCode || 500;
  // Send a generic error message to the client instead of the actual error details
  res.status(status).json({
    errorMessage: status === 500 ? 'An internal server error occurred. Please try again later.' : err.message,
  });
});

// try to connect to database and start listener
(async () => {
  try {
    // sync database and load sample data while project code is under developement
    // check environment variable NODE_DBSYNC
    if (process.env.NODE_DBSYNC === "true") {
      // polling for ready database
      let isDbReady = false;
      for (let i = 0; i < 5; i++) {
        try {
          await db.authenticate();
          isDbReady = true;
          break;
        } catch (err) {
          await sleep(10000);
        }
      }

      if (isDbReady) {
        await db.sync({ force: true });
        // load sample mountains
        for (const mountain of sampledata.mountains.features) {
          await Mountain.create({
            id: mountain.properties.id,
            name: mountain.properties.name,
            image: mountain.properties.img,
            elevation: mountain.properties.el,
            hasmountainrailway: mountain.properties.mountainrailway,
            longitude: mountain.geometry.coordinates[0],
            latitude: mountain.geometry.coordinates[1],
          });
        }
        // load sample users
        let testUsers;
        if (process.env.NODE_HASHED_PWD === "true") {
          testUsers = sampledata.users_hashed_pwd;
        } else {
          testUsers = sampledata.users_clear_pwd;
        }

        for (const user of testUsers) {
          await User.create({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            pwd: user.pwd,
            avatar: user.avatar,
          });
        }
        // associate mountains to users
        for (const userMountain of sampledata.userMountains) {
          await Mountain.update(
            {
              userId: userMountain.userid,
            },
            { where: { id: userMountain.mountainid } }
          );
        }

        // Run password hashing check after database is initialized and populated
        await checkAndChangePlaintextPasswords();
        logger.info('Password hashing check completed');
      } else {
        throw new Error("Database connection could not be established");
      }
    }
  } catch (err) {
    logger.error(err.message, {
      errno: err.errno,
      error: err,
    });
  } finally {
    api.listen(3000);
  }
})();
