const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');
const CondicionIva = require('./CondicionIva'); // Importa el modelo

const Tutor = sequelize.define('Tutor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    condicion_iva_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'condicion_iva', // Nombre de la tabla de los pacientes
        key: 'id',
        }
    }
},  {
    timestamps: true, // Activa createdAt y updatedAt
    createdAt: 'createdat', // Mapea el nombre en minúsculas
    updatedAt: 'updatedat',
    deletedAt: 'deletedat',
    paranoid: true,   // Activa deletedAt para borrado lógico
    tableName: 'tutores', // Especifica el nombre de la tabla
  });
  
Tutor.belongsTo(CondicionIva, { foreignKey: 'condicion_iva_id' });

  module.exports = Tutor;