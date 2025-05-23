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
const condicionIvaRoutes = require('./routes/condicionIvaRoutes');
const pacienteObraSocialRoutes = require('./routes/pacienteObraSocialRoutes');

const { revisarFacturasVencidas } = require('./cronJobs/facturasVencidas');
const { enviarRecordatorioLiquidacion } = require('./cronJobs/recordatorioLiquidacion');
const { inicializarConfiguracion } = require('./config/inicializarConfiguracion');
const CondicionIva = require('./models/CondicionIva');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Parsear JSON

// Rutas
app.use('/api/facturas', facturasRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/pacienteObraSocial', pacienteObraSocialRoutes);
app.use('/api/os', obrasSocialesRoutes);
app.use('/api/tutores', tutoresRoutes);
app.use('/api/configuracion', configuracionRoutes);
app.use('/api/notificaciones', notificacionesRoute);
app.use('/api/afip', afipRoutes);
app.use('/api/condicionIva', condicionIvaRoutes);

// Inicialización
(async () => {
  try {
    // Crea la base de datos si no existe
    await createDatabaseIfNotExists();
    // Sincroniza los modelos y las tablas
    await syncModels();
    // Inicializa la configuracion si no existe
    await inicializarConfiguracion();
    await seedCondicionIVA();
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

const seedCondicionIVA = async () => {
  const valores = [
    { id: 1, descripcion: 'IVA Responsable Inscripto' },
    { id: 4, descripcion: 'IVA Sujeto Exento' },
    { id: 5, descripcion: 'Consumidor Final' },
    { id: 6, descripcion: 'Responsable Monotributo' },
    { id: 7, descripcion: 'Sujeto No Categorizado' },
    { id: 8, descripcion: 'Proveedor del Exterior' },
    { id: 9, descripcion: 'Cliente del Exterior' },
    { id: 10, descripcion: 'IVA Liberado – Ley N° 19.640' },
    { id: 13, descripcion: 'Monotributista Social' },
    { id: 15, descripcion: 'IVA No Alcanzado' },
    { id: 16, descripcion: 'Monotributo Trabajador Independiente Promovido' },
  ];

  try {
    for (const valor of valores) {
      await CondicionIva.findOrCreate({
        where: { id: valor.id },
        defaults: valor,
      });
    }
    console.log('Datos de condición IVA insertados correctamente.');
  } catch (error) {
    console.error('Error al insertar datos en condición IVA:', error);
  }
};