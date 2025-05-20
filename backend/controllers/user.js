const bcrypt = require('bcryptjs');
const passport = require('passport');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  SEQ_DB_ERR,
  SEQ_UNIQUE_CONSTRAINT_ERR,
  BCRYPTSALTROUNDS
} = require("../util/const");

const { isEmpty } = require("../util/helper");
const User = require("../models/user");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, BCRYPTSALTROUNDS);
};

const checkAndChangePlaintextPasswords = async () => {
  try {
    const users = await User.findAll();
    for (const user of users) {
      // Check if password is not hashed (assuming hashed passwords are longer and contain $)
      if (!user.pwd.includes('$')) {
        const hashedPassword = await hashPassword(user.pwd);
        user.pwd = hashedPassword;
        await user.save();
      }
    }
  } catch (error) {
    console.error('Error updating plaintext passwords:', error);
  }
};

getUserByUsername = async (username) => {
  try {
    const resultSet = await User.findOne({
      where: { username: username },
    });
    res.status(HTTP_STATUS_OK).json(toGeoFeatureObj(resultSet));
  } catch (err) {
    err.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
    next(err);
  }
};

exports.loginWithPassport = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      err.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
      return next(err);
    }

    if (!user) {
      const error = new Error('Authentication failed.');
      error.statusCode = HTTP_STATUS_UNAUTHORIZED;
      return next(error);
    }

    req.logIn(user, (err) => {
      if (err) {
        err.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
        return next(err);
      }

      res.status(HTTP_STATUS_OK).json(user);
    });
  })(req, res, next);
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    
    if (!user) {
      const error = new Error('Authentication failed.');
      error.statusCode = HTTP_STATUS_UNAUTHORIZED;
      return next(error);
    }

    const isValidPassword = await bcrypt.compare(req.body.pwd, user.pwd);
    if (!isValidPassword) {
      const error = new Error('Authentication failed.');
      error.statusCode = HTTP_STATUS_UNAUTHORIZED;
      return next(error);
    }

    res.status(HTTP_STATUS_OK).json(user);
  } catch (err) {
    err.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const hashedPassword = await hashPassword(req.body.pwd);
    const user = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      pwd: hashedPassword,
      avatar: req.body.avatar,
    });
    res.status(HTTP_STATUS_CREATED).json(user);
  } catch (err) {
    if (err.name === SEQ_UNIQUE_CONSTRAINT_ERR) {
      err.statusCode = HTTP_STATUS_CONFLICT;
      err.message = `User already exists.`;
    } else {
      err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    let httpStatus = HTTP_STATUS_OK;
    let user = await User.findOne({
      where: { id: req.params.id },
    });
    if (isEmpty(user)) {
      httpStatus = HTTP_STATUS_NOT_FOUND;
      user = {};
    }

    res.status(httpStatus).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
    }
    next(err);
  }
};

exports.filterUsers = async (req, res, next) => {
  try {
    let users = new Array(0);
    if (isEmpty(req.query)) {
      users = await User.findAll();
    } else {
      try {
        users = await User.findAll({ where: req.query });
      } catch (err) {
        if (err.name === SEQ_DB_ERR) {
          err.message = `Invalid filter parameter.`;
          err.statusCode = HTTP_STATUS_BAD_REQUEST;
          throw err;
        }
      }
    }
    res.status(HTTP_STATUS_OK).json(users);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
    }
    next(err);
  }
};

exports.checkAndChangePlaintextPasswords = checkAndChangePlaintextPasswords;

exports.deleteUser = async (req, res, next) => {
  try {
    let countDeletedUsers = 0;
    let httpStatus = HTTP_STATUS_NOT_FOUND;
    if (!isEmpty(req.params.id)) {
      countDeletedUsers = await User.destroy({
        where: { id: req.params.id },
      });
    }
    if (countDeletedUsers != 0) {
      httpStatus = HTTP_STATUS_OK;
    }
    res.status(httpStatus).json({ usersDeleted: countDeletedUsers });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
