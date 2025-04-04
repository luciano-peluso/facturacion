const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const CondicionIva = require('./CondicionIva');

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
    unique: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  condicion_iva_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'condicion_iva', // Nombre de la tabla de los pacientes
      key: 'id',
    }
  }
  }, {
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
  deletedAt: 'deletedat',
  paranoid: true,
  tableName: 'obras_sociales',
});

ObraSocial.belongsTo(CondicionIva, { foreignKey: 'condicion_iva_id' });

module.exports = ObraSocial;