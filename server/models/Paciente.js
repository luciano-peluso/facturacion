const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');
const Tutor = require('./Tutor');

// Definición del modelo Paciente
const Paciente = sequelize.define('Paciente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },/* La comentamos porque ya no vamos a usar más este campo, sino que ahora usamos una tabla intermedia.
    obra_social_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'obras_sociales', // Nombre de la tabla de obra social
            key: 'id',
        },
        onUpdate: 'CASCADE', // Actualiza la clave foránea si cambia el ID
        onDelete: 'SET NULL',
    },*/
    tutor_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Puede ser null si no tiene tutor
        references: {
            model: 'tutores', // Nombre de la tabla de tutores
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
}, {
    timestamps: true, // Activa createdAt y updatedAt
    createdAt: 'createdat', // Mapea el nombre en minúsculas
    updatedAt: 'updatedat',
    deletedAt: 'deletedat',
    paranoid: true,   // Activa deletedAt para borrado lógico
    tableName: 'pacientes', // Especifica el nombre de la tabla
});

// Paciente.belongsToMany(ObraSocial, {
//     through: PacienteObraSocial,
//     foreignKey: 'paciente_id'
// })
Paciente.belongsTo(Tutor, { as: 'tutor', foreignKey: 'tutor_id' });

module.exports = Paciente;
