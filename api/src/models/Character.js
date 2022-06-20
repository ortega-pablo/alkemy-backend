const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("character", {
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    history: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
