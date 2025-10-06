// models/Vehiculo.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Marca = require("./marca");

const Vehiculo = sequelize.define(
  "Vehiculo",
  {
    id_vehiculo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    modelo: { type: DataTypes.STRING, allowNull: false },
    precio: { type: DataTypes.FLOAT, allowNull: false },
    imagen_vehiculo: { type: DataTypes.STRING, allowNull: true },
    id_marca: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Marcas", key: "id_marca" },
    },
  },
  {
    tableName: "Vehiculos",
    timestamps: false,
  }
);

// Asociación se define en models/index.js o aquí:
Vehiculo.belongsTo(Marca, { foreignKey: "id_marca", as: "marca" });
Marca.hasMany(Vehiculo, { foreignKey: "id_marca", as: "vehiculos" });

module.exports = Vehiculo;
