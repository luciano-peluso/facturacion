// config/inicializarConfiguracion.js
const Configuracion = require('../models/Configuracion');

const inicializarConfiguracion = async () => {
  const configuracion = await Configuracion.findOne();
  if (!configuracion) {
    await Configuracion.create({
      rango_precision: 10, // Porcentaje por defecto
      comision_consultorio: 15, // Comisión por defecto
    });
    console.log('Configuración inicializada con valores predeterminados');
  }
};

module.exports = { inicializarConfiguracion };
