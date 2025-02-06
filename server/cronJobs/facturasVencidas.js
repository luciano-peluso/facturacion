const cron = require('node-cron');
const { Op } = require('sequelize');
const { startOfMonth, subMonths, format } = require('date-fns');
const { es } = require('date-fns/locale');
const Factura = require('../models/Factura');
const Notificacion = require('../models/Notificacion');
const Paciente = require('../models/Paciente');

// Función para revisar facturas vencidas
const revisarFacturasVencidas = async (ejecutarInmediatamente = false) => {
    const tarea = async () => {
        console.log('[CRON JOB] Revisando facturas vencidas...');

        const mesesConfig = 3;
        const fechaLimite = startOfMonth(subMonths(new Date(), mesesConfig)); // Primer día del mes hace 3 meses

        try {
            const facturasVencidas = await Factura.findAll({
                where: {
                    estado: false, // No pagadas
                    fecha_facturada: { [Op.lt]: fechaLimite }, // Facturas más antiguas que la fecha límite
                },
                paranoid: true
            });

            if (facturasVencidas.length) {
                console.log(`[CRON JOB] Se encontraron ${facturasVencidas.length} facturas vencidas.`);
                for (const factura of facturasVencidas) {
                    const paciente = await Paciente.findByPk(factura.paciente_id, { paranoid: false });

                    if (!paciente) continue; // Si el paciente fue eliminado, saltamos

                    const mesFacturado = format(new Date(factura.fecha_facturada), "MMMM yyyy", { locale: es })
                        .replace(/^\w/, (c) => c.toUpperCase());

                    const mensaje = `La factura de ${mesFacturado} de ${paciente.nombre} está vencida.`;

                    // Verificar si la notificación ya existe
                    const existeNotificacion = await Notificacion.findOne({
                        where: { factura_id: factura.id },
                    });

                    if (!existeNotificacion) {
                        await Notificacion.create({ mensaje, factura_id: factura.id });
                        console.log(`[CRON JOB] Notificación creada para factura ${factura.id}.`);
                    } else if (existeNotificacion.leida) {
                        await existeNotificacion.update({ leida: false });
                        console.log(`[CRON JOB] Notificación de la factura ${factura.id} marcada como no leída nuevamente.`);
                    }
                }
            } else {
                console.log('[CRON JOB] No se encontraron facturas vencidas.');
            }
        } catch (error) {
            console.error('[CRON JOB] Error revisando facturas vencidas:', error);
        }
    };

    if (ejecutarInmediatamente) await tarea(); // Ejecutar inmediatamente

    cron.schedule('0 9 * * *', tarea); // Corre una vez al día a las 9 AM
};

module.exports = { revisarFacturasVencidas };
