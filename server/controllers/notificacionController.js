const Notificacion = require("../models/Notificacion")

const getNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notificacion.findAll({
            where: { leida: false },
            order: [['createdat', 'DESC']],
            paranoid: true,
        });
        res.status(200).json({success: true, data: notificaciones});
    } catch (error) {
        res.status(500).json({success: false, message:"Error al traer las notificaciones"+error});
    }
}

module.exports = {
    getNotificaciones
}