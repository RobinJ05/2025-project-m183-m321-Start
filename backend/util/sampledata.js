const fs = require("fs");
const path = require("path");

const rawdata = fs.readFileSync(
  path.join(__dirname, "..", "assets", "sampledata.json")
);
const sampledata = JSON.parse(rawdata);

module.exports.mountains = sampledata.mountains;
module.exports.users_hashed_pwd = sampledata.users_hashed_pwd;
module.exports.users_clear_pwd = sampledata.users_clear_pwd;
module.exports.userMountains = sampledata.user_mountains;

