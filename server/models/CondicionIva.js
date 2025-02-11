const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CondicionIva = sequelize.define('CondicionIva', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'condicion_iva', // Nombre de la tabla
    timestamps: false,          // No necesitas createdAt y updatedAt
});

module.exports = CondicionIva;