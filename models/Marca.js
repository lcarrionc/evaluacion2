// models/Marca.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Marca = sequelize.define(
  "Marca",
  {
    id_marca: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: { type: DataTypes.STRING, allowNull: false },
    pais_origen: { type: DataTypes.STRING, allowNull: true },
    imagen_marca: { type: DataTypes.STRING, allowNull: true }, // URL o path
  },
  {
    tableName: "Marcas",
    timestamps: false,
  }
);

module.exports = Marca;
