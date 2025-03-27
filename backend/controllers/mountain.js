const fs = require("fs");
const path = require("path");
const glob = require("glob");
const logger = require('../util/log');
const { validationResult } = require('express-validator');
const { addMountainLog, editMountainLog, deleteMountainLog } = require('../util/loggingEvents');

const { isEmpty } = require("../util/helper");
const Mountain = require("../models/mountain");
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_UNPROCESSABLE_CONTENT,
  STATIC_DIR,
  USE_SESSION_HANDLING
} = require("../util/const");
const { Op } = require("sequelize");

function toGeoFeatureObj(resultSet) {
  let mnt = {};
  if (!isEmpty(resultSet)) {
    mnt = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [resultSet.longitude, resultSet.latitude],
      },
      id: resultSet.id,
      name: resultSet.name,
      elevation: resultSet.elevation,
      img: isEmpty(resultSet.image)
        ? undefined
        : `${process.env.NODE_HOST}/${resultSet.image}`,
      mountainrailway: resultSet.hasmountainrailway,
    };
  }
  return mnt;
}

function removeImage(mntId) {
  const staticDir = path.join(process.cwd(), STATIC_DIR);
  const sanitizedMntId = String(mntId).replace(/[^a-zA-Z0-9-]/g, '');
  const pattern = path.join(staticDir, `${sanitizedMntId}.*`);
  glob(pattern, { nodir: true }, (err, images) => {
    if (err) {
      throw err;
    }
    for (const image of images) {
      if (image.startsWith(staticDir)) {
        fs.unlinkSync(image);
      }
    }
  });
}

function logSessionAndCookie(req, res, pageName) {
  // Only log session data when session handling is enabled
  if (!USE_SESSION_HANDLING) {
    return;
  }

  try {
    if (!req.sessionID) {
      logger.warn(`Session object not available for request to ${pageName}`);
      return;
    }
    if (!req.session.visitedPages) {
      req.session.visitedPages = [];
    }
    req.session.visitedPages.push(pageName);
    logger.info(`Session ${req.sessionID} visited page: ${pageName}. All visited pages: ${req.session.visitedPages.join(', ')}`);
    logger.info("cookie request: " + JSON.stringify(req.cookies));
  } catch (error) {
    logger.error(`Error logging session data: ${error.message}`);
  }
}

exports.getAllPublicMountainIds = async (req, res, next) => {
  try {
    logSessionAndCookie(req, res, 'overview');
    const resultSet = await Mountain.findAll({
      attributes: ["id"],
      where: { userId: { [Op.is]: null } },
    });
    const mntIds = resultSet.map((item) => item.id);
    res.status(HTTP_STATUS_OK).json(mntIds);
  } catch (err) {
    err.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
    next(err);
  }
};

exports.getPublicMountain = async (req, res, next) => {
  try {
    let httpStatus = HTTP_STATUS_NOT_FOUND;
    const mnt = await Mountain.findOne({
      where: {
        userId: { [Op.is]: null },
        id: req.params.id,
      },
    });
    if (!isEmpty(mnt)) {
      httpStatus = HTTP_STATUS_OK;
    }
    res.status(httpStatus).json(toGeoFeatureObj(mnt));
  } catch (err) {
    err.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
    next(err);
  }
};

exports.addPublicMountain = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("addPublicMountain validation error: ", errors);
      return res.status(HTTP_STATUS_UNPROCESSABLE_CONTENT).json({ errors: errors.array() });
    }

    console.log("addPublicMountain", req.body);
    const mountain = await Mountain.create({
      name: req.body.name,
      elevation: req.body.elevation,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      hasmountainrailway: req.body.hasmountainrailway
    });
    
    // Log the mountain creation
    await addMountainLog({
      name: mountain.name,
      el: mountain.elevation,
      mountainrailway: mountain.hasmountainrailway
    });
    
    res.status(HTTP_STATUS_CREATED).json(toGeoFeatureObj(mountain));
    console.log("addPublicMountain end with Id: ", mountain.id);
  } catch (err) {
    console.log("addPublicMountain error: ", err);
    err.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
    next(err);
  }
};

exports.updatePublicMountain = async (req, res, next) => {
  try {
    let httpStatus = HTTP_STATUS_NOT_FOUND;
    let mnt = await Mountain.findOne({
      where: {
        userId: { [Op.is]: null },
        id: req.params.id,
      },
    });
    // console.error(`mnt: ${mnt}`);
    if (!isEmpty(mnt)) {
      if (!isEmpty(req.body.name)) {
        mnt.name = req.body.name;
      }
      if (!isEmpty(req.body.elevation)) {
        mnt.elevation = req.body.elevation;
      }
      if (!isEmpty(req.body.longitude)) {
        mnt.longitude = req.body.longitude;
      }
      if (!isEmpty(req.body.latitude)) {
        mnt.latitude = req.body.latitude;
      }
      if (!isEmpty(req.body.hasmountainrailway)) {
        mnt.hasmountainrailway = req.body.hasmountainrailway;
      }
      await mnt.save();
      
      // Log the mountain update
      await editMountainLog({
        name: mnt.name,
        el: mnt.elevation,
        mountainrailway: mnt.hasmountainrailway
      });
      
      httpStatus = HTTP_STATUS_OK;
    }
    res.status(httpStatus).json(toGeoFeatureObj(mnt));
  } catch (err) {
    err.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
    next(err);
  }
};

exports.addPublicMountainImage = async (req, res, next) => {
  try {
    console.log("start addPublicMountainImage");
    const mountainId = String(req.params.mntid).replace(/[^a-zA-Z0-9-]/g, '');
    console.log("MountainID: " + mountainId);

    if (!req.file || !req.file.filename) {
      const error = new Error('No image file provided');
      error.statusCode = HTTP_STATUS_BAD_REQUEST;
      throw error;
    }

    const fileExtension = path.extname(req.file.filename).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    if (!allowedExtensions.includes(fileExtension)) {
      const error = new Error('Invalid file type');
      error.statusCode = HTTP_STATUS_BAD_REQUEST;
      throw error;
    }

    let httpStatus = HTTP_STATUS_NOT_FOUND;
    let mnt = await Mountain.findOne({
      where: {
        userId: { [Op.is]: null },
        id: mountainId,
      },
    });

    if (!isEmpty(mnt)) {
      const sanitizedFilename = path.basename(req.file.filename);
      mnt.image = sanitizedFilename;
      await mnt.save();
      httpStatus = HTTP_STATUS_OK;
    } else {
      removeImage(mountainId);
    }

    res.status(httpStatus).json(toGeoFeatureObj(mnt));
  } catch (err) {
    console.log("addPublicMountainImage error: ", err);
    err.statusCode = err.statusCode || HTTP_STATUS_INTERNAL_SERVER_ERROR;
    removeImage(mountainId);
    next(err);
  }
};

exports.deletePublicMountain = async (req, res, next) => {
  try {
    let httpStatus = HTTP_STATUS_NOT_FOUND;
    let countDeletedMnt = 0;
    const mntId = req.params.id;
    if (!isEmpty(mntId)) {
      countDeletedMnt = await Mountain.destroy({
        where: {
          userId: { [Op.is]: null },
          id: mntId,
        },
      });

      if (countDeletedMnt != 0) {
        const mnt = await Mountain.findOne({
          where: {
            userId: { [Op.is]: null },
            id: mntId,
          },
        });
        
        // Log the mountain deletion
        if (mnt) {
          await deleteMountainLog({
            name: mnt.name,
            el: mnt.elevation,
            mountainrailway: mnt.hasmountainrailway
          });
        }
        
        httpStatus = HTTP_STATUS_OK;
        removeImage(mntId);
      }
    }
    res.status(httpStatus).json({ mountainsDeleted: countDeletedMnt });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.calculateStatistics = async (req, res, next) => {
  try {
    const elevationLevel = parseInt(req.params.elevationLevel);

    if (isNaN(elevationLevel)) {
      const error = new Error('Invalid elevation level');
      error.statusCode = HTTP_STATUS_UNPROCESSABLE_CONTENT;
      throw error;
    }

    const allMountains = await Mountain.findAll({
      where: {
        userId: { [Op.is]: null }
      },
      attributes: ['id', 'name', 'elevation', 'latitude']
    });

    const highestMountain = allMountains.reduce((max, mountain) => 
      mountain.elevation > (max?.elevation || 0) ? mountain : max, null);

    const northernmostMountain = allMountains.reduce((north, mountain) => 
      mountain.latitude > (north?.latitude || -90) ? mountain : north, null);

    const statistics = {
      mountainsAboveThreshold: allMountains.filter(m => m.elevation > elevationLevel).length,
      highestMountain: highestMountain ? {
        name: highestMountain.name,
        elevation: highestMountain.elevation
      } : null,
      northernmostMountain: northernmostMountain ? {
        name: northernmostMountain.name,
        latitude: northernmostMountain.latitude
      } : null
    };

    res.status(HTTP_STATUS_OK).json(statistics);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
    }
    next(err);
  }
};
