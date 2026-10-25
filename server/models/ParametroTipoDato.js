const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ParametroTipoDato = sequelize.define('ParametroTipoDato', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  key_tipo_dato: {
    type: DataTypes.STRING(50),
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
  tableName: 'par_tipo_dato',
});

module.exports = ParametroTipoDato;
