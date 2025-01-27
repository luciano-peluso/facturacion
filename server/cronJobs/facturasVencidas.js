const cron = require('node-cron');
const { Op } = require('sequelize');
const Factura = require('../models/Factura');
const Notificacion = require('../models/Notificacion');

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
                    const existeNotificacion = await Notificacion.findOne({
                      where: { 
                        factura_id: factura.id, 
                        deletedat: null // Si estás usando borrado lógico
                      },
                    });
                    if (!existeNotificacion) {
                      await Notificacion.create({
                        mensaje: `La factura #${factura.id} está vencida.`,
                        factura_id: factura.id,
                      });
                    }
                  });
              } else {
                console.log('[CRON JOB] No se encontraron facturas vencidas.');
              }
            } catch (error) {
              console.error('[CRON JOB] Error revisando facturas vencidas:', error);
            }
    })  
}

module.exports = { revisarFacturasVencidas };