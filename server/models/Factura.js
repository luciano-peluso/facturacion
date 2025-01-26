const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Definimos el modelo de Factura
const Factura = sequelize.define('Factura', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    paciente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pacientes', // Nombre de la tabla de los pacientes
        key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    },
    punto_de_venta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_factura: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monto: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    fecha_emision: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_facturada: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    timestamps: true, // Activa createdAt y updatedAt
    createdAt: 'createdat', // Mapea el nombre en minúsculas
    updatedAt: 'updatedat',
    deletedAt: 'deletedat',
    paranoid: true,   // Activa deletedAt para borrado lógico
    tableName: 'facturas', // Especifica el nombre de la tabla
  });
  
  module.exports = Factura;