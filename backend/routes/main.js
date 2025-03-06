// moudule providing objects and functions for routing
const express = require("express");

// utility to handle file uploads
const multer = require("multer");

// import controller functions
const mountainCtrl = require("../controllers/mountain");
const userCtrl = require("../controllers/user");
const miscCtrl = require("../controllers/misc");
const { USE_SESSION_HANDLING } = require("../util/const");
const { keycloak } = require("../config/keycloak-config");

// define storage location and filename for uploaded image files
const imgStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "public");
  },
  filename(req, file, callback) {
    const fileExt = file.mimetype.split("/")[1];
    filename = `${req.params.mntid}.${fileExt}`;
    callback(null, filename);
  },
});

// file filter function: accept only images
const filter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
// create a multer object to handle uploaded files
const upload = multer({ storage: imgStorage, fileFilter: filter }).single("img");

const router = express.Router();

// Use appropriate login handler based on authentication method
router.post('/login', USE_SESSION_HANDLING ? userCtrl.loginWithPassport : userCtrl.login);
router.get('/users', userCtrl.filterUsers);
router.post('/users', userCtrl.signup);
router.delete('/users/:id', userCtrl.deleteUser);
router.get('/users/:id', userCtrl.getUser);

router.get("/mnts", mountainCtrl.getAllPublicMountainIds);
router.get("/mnts/:id", mountainCtrl.getPublicMountain);
router.post("/mnts", keycloak.protect(), mountainCtrl.addPublicMountain);
router.put("/mnts/:id", keycloak.protect(), mountainCtrl.updatePublicMountain);
router.put("/mnts/:mntid/img", upload, mountainCtrl.addPublicMountainImage);
router.delete('/mnts/:id', mountainCtrl.deletePublicMountain);

router.get("/", miscCtrl.default);
router.get('/avatars', miscCtrl.getAvatars);

// for testing purpose only, not used by frontend application
router.get('/images', miscCtrl.getImage);

module.exports = router;
