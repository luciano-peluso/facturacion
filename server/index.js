require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const { createDatabaseIfNotExists, syncModels } = require('./config/db');
const { inicializarConfiguracion } = require('./config/inicializarConfiguracion'); // El archivo con la función


const facturasRoutes = require('./routes/facturasRoutes');
const pacientesRoutes = require('./routes/pacienteRoutes');
const obrasSocialesRoutes = require('./routes/obrasSocialesRoutes');
const tutoresRoutes = require('./routes/tutoresRoutes');
const configuracionRoutes = require('./routes/configuracionRoutes');

const { revisarFacturasVencidas } = require('./cronJobs/facturasVencidas');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Parsear JSON

// Rutas
app.use('/api/facturas', facturasRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/os', obrasSocialesRoutes);
app.use('/api/tutores', tutoresRoutes);
app.use('/api/configuracion', configuracionRoutes);

// Inicialización
(async () => {
  try {
    // Inicializa la configuracion si no existe
    await inicializarConfiguracion();
    // Crea la base de datos si no existe
    await createDatabaseIfNotExists();

    // Sincroniza los modelos y las tablas
    await syncModels();

    // Inicia el servidor
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });

    // Ejecuta el cron job
    revisarFacturasVencidas();
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
})();