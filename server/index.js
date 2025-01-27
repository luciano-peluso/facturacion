const express = require('express');
require('dotenv').config(); 
const cors = require('cors');

const facturasRoutes = require('./routes/facturasRoutes'); 
const pacientesRoutes = require('./routes/pacienteRoutes');
const obrasSocialesRoutes = require('./routes/obrasSocialesRoutes');
const tutoresRoutes = require('./routes/tutoresRoutes');
const { revisarFacturasVencidas } = require('./cronJobs/facturasVencidas')
const { getNotificaciones } = require('./controllers/notificacionController');

const app = express();

app.use(cors());

const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json()); // Parsear JSON

app.use('/api/facturas', facturasRoutes); // Prefijo para las rutas de facturas
app.use('/api/pacientes', pacientesRoutes); // Prefijo para las rutas de pacientes
app.use('/api/os', obrasSocialesRoutes); // Prefijo para las rutas de las obras sociales
app.use('/api/tutores', tutoresRoutes); // Prefijo para las rutas de las obras sociales
app.get('/api/notificaciones', getNotificaciones);

revisarFacturasVencidas();

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});