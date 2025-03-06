const glob = require("glob");

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_INETERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  STATIC_DIR,
} = require("../util/const");
const path = require("path");
const { isEmpty } = require("../util/helper");

exports.default = (req, res, next) => {
  res.status(HTTP_STATUS_OK).json({});
};

exports.getAvatars = (req, res, next) => {
  try {
    const staticDir = path.join(process.cwd(), STATIC_DIR);
    const avatars = glob.sync(`avatar*.svg`, {
      cwd: staticDir,
      absolute: false,
    });

    let avatarUrls = new Array(0);
    if (avatars) {
      avatarUrls = avatars.map(
        (avatar) => `${process.env.NODE_HOST}/${avatar}`
      );
    }

    res.status(HTTP_STATUS_OK).json(avatarUrls);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    }
    next(err);
  }
};

// for testing purpose only, not used by frontend application
exports.getImage = (req, res, next) => {
  let options = {
    root: path.join(process.cwd(), STATIC_DIR),
  };

  if (isEmpty(req.query.filename)) {
    res.sendStatus(HTTP_STATUS_BAD_REQUEST);
  } else {
    let fileName = req.query.filename.toString();
    res.sendFile(fileName, options, (err) => {
      if (err) {
        next(err);
      }
    });
  }
};
