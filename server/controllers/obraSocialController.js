const ObraSocial = require('../models/ObraSocial');

const getObrasSociales = async (req, res) => {
    try {
        const obras_sociales = await ObraSocial.findAll({ paranoid:true }); 
        res.status(200).json({success: true, message:"Obras Sociales traidas con éxito", data: obras_sociales});
    } catch (error) {
        console.error("Error al traer las Obras Sociales: ", error);
        res.status(500).json({success: false, message: "Error al traer las Obras Sociales."});
    }
}

const getObraSocialById = async (req, res) => {
    const { id } = req.params;
    try {
        const obra_social = await ObraSocial.findByPk(id);
        if (!obra_social) {
            return res.status(404).json({ success: false, message: "Obra Social no encontrada" });
        }
        res.status(200).json({ success: true, data: obra_social });
    } catch (error) {
        console.error("Error al traer la obra social:", error);
        res.status(500).json({ success: false, message: "Error al traer la obra social" });
    }
};

const createObraSocial = async (req, res) => {
    const { nombre, cuit, mail, telefono, clasificacion } = req.body;
    try {
        const obra_social = await ObraSocial.create({ nombre, cuit, mail, telefono, clasificacion });
        res.status(201).json({ success: true, message: "Obra Social creada", data: obra_social });
    } catch (error) {
        console.error("Error al crear la obra social:", error);
        res.status(500).json({ success: false, message: "Error al crear la obra social" });
    }
};

const updateObraSocial = async (req, res) => {
    const { id } = req.params;
    const { nombre, cuit, mail, telefono, clasificacion } = req.body;
    try {
        const obra_social = await ObraSocial.findByPk(id);
        if (!obra_social) {
            return res.status(404).json({ success: false, message: "Obra Social no encontrada" });
        }
        await obra_social.update({ nombre, cuit, mail, telefono, clasificacion });
        res.status(200).json({ success: true, message: "Obra Social actualizada", data: obra_social });
    } catch (error) {
        console.error("Error al actualizar la obra social:", error);
        res.status(500).json({ success: false, message: "Error al actualizar la obra social" });
    }
};

const deleteObraSocial = async (req, res) => {
    const { id } = req.params;
    try {
        const obra_social = await ObraSocial.findByPk(id);
        if (!obra_social) {
            return res.status(404).json({ success: false, message: "Obra social no encontrada" });
        }
        await obra_social.destroy();
        res.status(200).json({ success: true, message: "Obra social eliminada" });
    } catch (error) {
        console.error("Error al eliminar la obra social:", error);
        res.status(500).json({ success: false, message: "Error al eliminar la obra social" });
    }
};

module.exports = {
    getObrasSociales,
    getObraSocialById,
    createObraSocial,
    updateObraSocial,
    deleteObraSocial,
};
