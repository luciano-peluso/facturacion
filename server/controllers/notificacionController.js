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

const marcarComoLeida = async (req, res) => {
    const { id } = req.params;
    try {
        const notificacion = await Notificacion.findByPk(id);
        if(!notificacion) {
            res.status(404).json({success: false, message:"No se encontro la notificación"});
        }
        await notificacion.update({leida: true});
        res.status(200).json({success: true, data: notificacion});
    } catch (error) {
        res.status(500).json({success: false, message:"Error al actualizar la notificación: "+error});
    }
}

const deleteNotificacion = async (req, res) => {
    const { id } = req.params;
    try {
        const notificacion = await Notificacion.findByPk(id);
        if(!notificacion) {
            res.status(404).json({success: false, message:"No se encontro la notificación"});
        }
        await notificacion.destroy();
        res.status(200).json({success: true, message:"Se elimino correctamente la notificación"});
    } catch (error) {
        res.status(500).json({success: false, message:"Error al eliminar la notificación: "+error});
    }
}

module.exports = {
    getNotificaciones,
    marcarComoLeida,
    deleteNotificacion
}