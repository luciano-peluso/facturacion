const cron = require('node-cron');
const { Op } = require('sequelize');
const { format, addDays, isWeekend, getMonth } = require('date-fns');
const { es } = require('date-fns/locale');
const Notificacion = require('../models/Notificacion');

// Función para verificar si es el último día hábil del mes
const esUltimoDiaHabil = () => {
    let fecha = new Date();

    // Avanzamos hasta el próximo día laborable
    let siguienteDia = addDays(fecha, 1);
    while (isWeekend(siguienteDia)) {
        siguienteDia = addDays(siguienteDia, 1);
    }

    // Si el siguiente día cambia de mes, entonces hoy es el último día hábil
    return getMonth(siguienteDia) !== getMonth(fecha);
};

// Función para enviar recordatorio de liquidación
const enviarRecordatorioLiquidacion = async (ejecutarInmediatamente = false) => {
    const tarea = async () => {
        console.log('[CRON JOB] Revisando recordatorio de liquidación...');

        if (!esUltimoDiaHabil()) {
            console.log('[CRON JOB] No es el último día hábil del mes. No se envía recordatorio.');
            return;
        }

        const mensaje = "Es el último día hábil ¿Ya enviaste la liquidación?";

        const existeNotificacion = await Notificacion.findOne({
            where: {
                mensaje,
                factura_id: null,
                leida: false,
                deletedat: null,
                createdat: { [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) }
            },
        });

        if (!existeNotificacion) {
            await Notificacion.create({ mensaje });
            console.log('[CRON JOB] Notificación de recordatorio de liquidación creada.');
        } else {
            console.log('[CRON JOB] La notificación de liquidación ya fue enviada hoy.');
        }
    };

    if (ejecutarInmediatamente) await tarea(); // Ejecutar inmediatamente

    cron.schedule('0 9 * * *', tarea); // Se ejecuta cada día a las 9 AM
};

module.exports = { enviarRecordatorioLiquidacion };
