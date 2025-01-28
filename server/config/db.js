const { Sequelize } = require('sequelize');
const pgtools = require('pgtools');

// Datos de conexión
const DB_NAME = process.env.DB_NAME || 'facturacion';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'admin';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;

// Crear la base de datos si no existe
const createDatabaseIfNotExists = async () => {
  try {
    await pgtools.createdb(
      {
        user: DB_USER,
        password: DB_PASSWORD,
        host: DB_HOST,
        port: DB_PORT,
      },
      DB_NAME
    );
    console.log(`Base de datos '${DB_NAME}' creada con éxito.`);
  } catch (error) {
    if (error.name === 'duplicate_database') {
      console.log(`La base de datos '${DB_NAME}' ya existe.`);
    } else {
      console.error('Error al crear la base de datos:', error);
      process.exit(1); // Finaliza si ocurre un error crítico
    }
  }
};

// Instancia de Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false, // Desactiva logs para que sea más limpio
});

// Función para sincronizar los modelos y las tablas
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true }); // Crea o actualiza las tablas según los modelos
    console.log('¡Tablas sincronizadas correctamente!');
  } catch (error) {
    console.error('Error al sincronizar las tablas:', error);
    process.exit(1); // Finaliza si ocurre un error crítico
  }
};

module.exports = { sequelize, createDatabaseIfNotExists, syncModels };
