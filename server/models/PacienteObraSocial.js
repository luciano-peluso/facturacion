const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');
const ObraSocial = require('./ObraSocial');
const Paciente = require('./Paciente');
const Factura = require('./Factura');

// Definición del modelo de la relacion Paciente_ObraSocial
const PacienteObraSocial = sequelize.define('PacienteObraSocial', {
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
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    obra_social_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'obras_sociales', // Nombre de la tabla de obra social
            key: 'id',
        },
        onUpdate: 'CASCADE', // Actualiza la clave foránea si cambia el ID
        onDelete: 'CASCADE',
    },
}, {
    timestamps: true, // Activa createdAt y updatedAt
    createdAt: 'createdat', // Mapea el nombre en minúsculas
    updatedAt: 'updatedat',
    deletedAt: 'deletedat',
    paranoid: true,   // Activa deletedAt para borrado lógico
    tableName: 'paciente_obrasocial', // Especifica el nombre de la tabla
});

// Establecimiento de asociaciones
PacienteObraSocial.belongsTo(Paciente, { foreignKey: 'paciente_id', as: "paciente"});
Paciente.hasMany(PacienteObraSocial, { foreignKey: 'paciente_id' });

PacienteObraSocial.belongsTo(ObraSocial, { foreignKey: 'obra_social_id', as: "obra_social" });
ObraSocial.hasMany(PacienteObraSocial, { foreignKey: 'obra_social_id' });

module.exports = PacienteObraSocial;
