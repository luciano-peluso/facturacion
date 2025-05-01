const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');
const Paciente = require('./Paciente');
const PacienteObraSocial = require('./PacienteObraSocial');

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
        model: 'pacientes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    paciente_obra_social_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'paciente_obrasocial', 
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
  Factura.belongsTo(PacienteObraSocial, {
    foreignKey: 'paciente_obra_social_id',
    as: 'paciente_obra_social'
  });
  
  Factura.belongsTo(Paciente, {
    foreignKey: 'paciente_id',
    as: 'paciente'
  });

module.exports = Factura;