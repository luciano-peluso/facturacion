require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const { createDatabaseIfNotExists, syncModels } = require('./config/db');

const facturasRoutes = require('./routes/facturasRoutes');
const pacientesRoutes = require('./routes/pacienteRoutes');
const obrasSocialesRoutes = require('./routes/obrasSocialesRoutes');
const tutoresRoutes = require('./routes/tutoresRoutes');
const configuracionRoutes = require('./routes/configuracionRoutes');
const notificacionesRoute = require('./routes/notificacionRoutes');
const afipRoutes = require('./routes/afipRoutes.cjs');

const { revisarFacturasVencidas } = require('./cronJobs/facturasVencidas');
const { enviarRecordatorioLiquidacion } = require('./cronJobs/recordatorioLiquidacion');
const { inicializarConfiguracion } = require('./config/inicializarConfiguracion');

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
app.use('/api/notificaciones', notificacionesRoute);
app.use('/api/afip', afipRoutes);

// Inicialización
(async () => {
  try {
    // Inicializa la configuracion si no existe
    await inicializarConfiguracion();
    // Crea la base de datos si no existe
    await createDatabaseIfNotExists();
    // Sincroniza los modelos y las tablas
    await syncModels();

    // Se inicia el servidor
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });


    // Ejecutar manualmente al iniciar el servidor
    console.log('[INICIO] Ejecutando revisión de facturas vencidas...');
    await revisarFacturasVencidas(true); // Pasamos true para ejecución inmediata
    console.log('[INICIO] Ejecutando recordatorio de liquidación...');
    await enviarRecordatorioLiquidacion(true);

    // Iniciar cronjobs para ejecución periódica
    revisarFacturasVencidas();
    enviarRecordatorioLiquidacion();
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
})();