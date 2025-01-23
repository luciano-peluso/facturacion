const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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
},  {
    timestamps: true, // Activa createdAt y updatedAt
    createdAt: 'createdat', // Mapea el nombre en minúsculas
    updatedAt: 'updatedat',
    deletedAt: 'deletedat',
    paranoid: true,   // Activa deletedAt para borrado lógico
    tableName: 'tutores', // Especifica el nombre de la tabla
  });
  
  module.exports = Tutor;