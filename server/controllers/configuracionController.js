const CondicionIva = require('../models/CondicionIva');
const Configuracion = require('../models/Configuracion');

const getConfiguracion = async (req, res) => {
    try {
        const configuracion = await Configuracion.findOne({ paranoid:true }); 
        res.status(200).json({success: true, message:"Configuracion traida con éxito", data: configuracion});
    } catch (error) {
        console.error("Error al traer la configuracion: ", error);
        res.status(500).json({success: false, message: "Error al traer la configuracion."});
    }
}

const createConfiguracion = async (req, res) => {
    const { rango_precision, comision_consultorio } = req.body;
    try {
        const configuracion = await Configuracion.create({ rango_precision, comision_consultorio });
        res.status(201).json({ success: true, message: "Configuracion creada", data: configuracion });
    } catch (error) {
        console.error("Error al crear la configuracion:", error);
        res.status(500).json({ success: false, message: "Error al crear la configuracion" });
    }
};

const updateConfiguracion = async (req, res) => {
    const { rango_precision, comision_consultorio, razon_social, domicilio, ingresos_brutos, inicio_actividades, condicion_iva_id } = req.body;
    try {
        const configuracion = await Configuracion.findOne();
        if (!configuracion) {
            return res.status(404).json({ success: false, message: "Configuracion no encontrada" });
        }
        await configuracion.update({ rango_precision, comision_consultorio, razon_social, domicilio, ingresos_brutos, inicio_actividades, condicion_iva_id });
        res.status(200).json({ success: true, message: "Configuracion actualizada", data: configuracion });
    } catch (error) {
        console.error("Error al actualizar la configuracion:", error);
        res.status(500).json({ success: false, message: "Error al actualizar la configuracion: "+error });
    }
};

const deleteConfiguracion = async (req, res) => {
    try {
        const configuracion = await Configuracion.findOne();
        if (!configuracion) {
            return res.status(404).json({ success: false, message: "Configuracion no encontrada" });
        }
        await configuracion.destroy();
        res.status(200).json({ success: true, message: "Configuracion eliminada" });
    } catch (error) {
        console.error("Error al eliminar la configuracion:", error);
        res.status(500).json({ success: false, message: "Error al eliminar la configuracion" });
    }
};

const getConfiguracionAfip = async (req, res) => {
    try {
        const configuracion = await Configuracion.findOne({
            attributes: ['razon_social', 'domicilio', 'condicion_iva_id', 'ingresos_brutos', 'inicio_actividades'],
            include: { model: CondicionIva, attributes:['descripcion']}
        });

        if (!configuracion) {
            return res.status(404).json({ success: false, message: "Configuración no encontrada" });
        }

        res.status(200).json({ success: true, data: configuracion });
    } catch (error) {
        console.error("Error al obtener la configuración:", error);
        res.status(500).json({ success: false, message: "Error al obtener la configuración" });
    }
};

module.exports = {
    getConfiguracion,
    getConfiguracionAfip,
    createConfiguracion,
    updateConfiguracion,
    deleteConfiguracion,
};
