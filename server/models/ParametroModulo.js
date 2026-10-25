const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ParametroModulo = sequelize.define('ParametroModulo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  key_modulo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: false,
  tableName: 'par_modulo',
});

module.exports = ParametroModulo;
