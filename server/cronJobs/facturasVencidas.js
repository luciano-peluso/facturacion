const cron = require('node-cron');
const { Op } = require('sequelize');
const Factura = require('../models/Factura');
const Notificacion = require('../models/Notificacion');
const Paciente = require('../models/Paciente');

const revisarFacturasVencidas = () => {
    cron.schedule('0 * * * *', async () => {
        console.log('[CRON JOB] Revisando facturas vencidas...');

        const mesesConfig = 3;
        const hoyMesesAtras = new Date();
        hoyMesesAtras.setMonth(hoyMesesAtras.getMonth() - mesesConfig);

        try {
            const facturasVencidas = await Factura.findAll({
                where: {
                    estado: false,
                    fecha_facturada: { [Op.lt]: hoyMesesAtras },
                },
                paranoid: true
            });

            if (facturasVencidas.length) {
                console.log(`[CRON JOB] Se encontraron ${facturasVencidas.length} facturas vencidas.`);
                facturasVencidas.forEach(async (factura) => {
                  const paciente = await Paciente.findByPk(factura.paciente_id, { paranoid: false });
                  const mesFacturado = new Date(factura.fecha_facturada).toLocaleString('es-AR', { month: 'long', year: 'numeric' });
                  
                  // Crear el mensaje
                  const mensaje = `La factura de ${mesFacturado} de ${paciente.nombre} está vencida.`;
                
                  // Verificar si la notificación ya existe
                  const existeNotificacion = await Notificacion.findOne({
                    where: { 
                      factura_id: factura.id, 
                      deletedat: null 
                    },
                  });
                
                  if (!existeNotificacion) {
                    // Crear la notificación
                    await Notificacion.create({
                      mensaje: mensaje,
                      factura_id: factura.id,
                    });
                  }
                })
              } else {
                console.log('[CRON JOB] No se encontraron facturas vencidas.');
              }
            } catch (error) {
              console.error('[CRON JOB] Error revisando facturas vencidas:', error);
            }
    })  
}

module.exports = { revisarFacturasVencidas };