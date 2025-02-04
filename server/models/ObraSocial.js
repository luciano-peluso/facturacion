const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Asegúrate de que la ruta sea correcta

const ObraSocial = sequelize.define('ObraSocial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cuit: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  mail: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
}, {
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
  deletedAt: 'deletedat',
  paranoid: true,
  tableName: 'obras_sociales',
});

module.exports = ObraSocial;