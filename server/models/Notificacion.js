const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Factura = require('./Factura');

const Notificacion = sequelize.define('Notificacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  mensaje: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  factura_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'facturas',
      key: 'id',
    },
  },
  leida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Indica si la notificación ya fue leída
  },
}, {
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
  deletedAt: 'deletedat',
  paranoid: true,
  tableName: 'notificaciones',
});

Notificacion.belongsTo(Factura, { as: 'factura', foreignKey: 'factura_id' });

module.exports = Notificacion;