const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');

const Configuracion = sequelize.define('Configuracion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rango_precision: {
    type: DataTypes.FLOAT,  // Puede ser un valor de porcentaje (ej: 10 para 10%)
    allowNull: false,
    defaultValue: 10,  // Valor por defecto de 10%
  },
  comision_consultorio: {
    type: DataTypes.FLOAT,  // Comisión en porcentaje (ej: 15 para 15%)
    allowNull: false,
    defaultValue: 15,  // Valor por defecto de 15%
  },
}, {
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
  deletedAt: 'deletedat',
  paranoid: true,
  tableName: 'configuracion',  // Nombre de la tabla
});

module.exports = Configuracion;