const { Model, DataTypes } = require("sequelize");
const db = require("../util/db");
const Mountain = require("./mountain");

class User extends Model {}
User.init(
  {
    firstname: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    pwd: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      get() {
        return `${process.env.NODE_HOST}/${this.getDataValue("avatar")}`;
      },
    },
  },
  { sequelize: db, modelName: "user", freezeTableName: true }
);

// define model associations
User.hasMany(Mountain, { onDelete: "CASCADE", onUpdate: "CASCADE" });

module.exports = User;
