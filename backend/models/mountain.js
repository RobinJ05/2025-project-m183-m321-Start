const { Model, DataTypes } = require("sequelize");
const db = require("../util/db");

class Mountain extends Model {}
Mountain.init(
  {
    name: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    elevation: {
      type: DataTypes.FLOAT,
    },
    hasmountainrailway: {
      type: DataTypes.BOOLEAN,
    },
    image: {
      type: DataTypes.STRING,
    },
  },
  { sequelize: db, modelName: "mountain", freezeTableName: true }
);

module.exports = Mountain;
