const express = require('express');
require('dotenv').config(); 
const facturaRoutes = require('./routes/facturasRoutes'); 

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json()); // Parsear JSON
app.use('/api/facturas', facturaRoutes); // Prefijo para las rutas de facturas

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});