const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');
const Paciente = require('./Paciente');

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
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    fecha_emision: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_facturada: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_cobro: {
      type: DataTypes.DATEONLY,
      allowNull: true, // Debe estar en null hasta que se cobre
    },
    es_consultorio: {
      type: DataTypes.BOOLEAN,
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
  // Factura pertenece a un Paciente
Factura.belongsTo(Paciente, { as: 'paciente', foreignKey: 'paciente_id' });

module.exports = Factura;