const express = require('express');
require('dotenv').config(); 
const cors = require('cors');

const facturaRoutes = require('./routes/facturasRoutes'); 

const app = express();

app.use(cors());

const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json()); // Parsear JSON
app.use('/api/facturas', facturaRoutes); // Prefijo para las rutas de facturas

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});