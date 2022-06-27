const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("user", {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isAlpha:{
          msg: "El nombre solo puede contener letras."
        }
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isAlpha:{
          msg: "El apellido solo puede contener letras."
        }
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
        isEmail:{
          msg: "Ingrese una dirección de correo válida."
        }
      },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  });
};