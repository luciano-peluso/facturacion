const Tutor = require('../models/Tutor');

const getTutores = async (req, res) => {
    try {
        const tutores = await Tutor.findAll({ paranoid:true }); 
        res.status(200).json({success: true, message:"Tutores traidos con éxito", data: tutores});
    } catch (error) {
        console.error("Error al traer los tutores: ", error);
        res.status(500).json({success: false, message: "Error al traer los tutores."});
    }
}

const getTutorById = async (req, res) => {
    const { id } = req.params;
    try {
        const tutor = await Tutor.findByPk(id);
        if (!tutor) {
            return res.status(404).json({ success: false, message: "Tutor no encontrado" });
        }
        res.status(200).json({ success: true, data: tutor });
    } catch (error) {
        console.error("Error al traer el tutor:", error);
        res.status(500).json({ success: false, message: "Error al traer el tutor" });
    }
};

const createTutor = async (req, res) => {
    const { nombre, dni } = req.body;
    try {
        const tutor = await Tutor.create({ nombre, dni });
        res.status(201).json({ success: true, message: "Tutor creado", data: tutor });
    } catch (error) {
        console.error("Error al crear el tutor:", error);
        res.status(500).json({ success: false, message: "Error al crear el tutor" });
    }
};

const updateTutor = async (req, res) => {
    const { id } = req.params;
    const { nombre, dni } = req.body;
    try {
        const tutor = await Tutor.findByPk(id);
        if (!tutor) {
            return res.status(404).json({ success: false, message: "Tutor no encontrado" });
        }
        await tutor.update({ nombre, dni });
        res.status(200).json({ success: true, message: "Tutor actualizado", data: tutor });
    } catch (error) {
        console.error("Error al actualizar el tutor:", error);
        res.status(500).json({ success: false, message: "Error al actualizar el tutor" });
    }
};

const deleteTutor = async (req, res) => {
    const { id } = req.params;
    try {
        const tutor = await Tutor.findByPk(id);
        if (!tutor) {
            return res.status(404).json({ success: false, message: "Tutor no encontrado" });
        }
        await tutor.destroy();
        res.status(200).json({ success: true, message: "Tutor eliminado" });
    } catch (error) {
        console.error("Error al eliminar el tutor:", error);
        res.status(500).json({ success: false, message: "Error al eliminar el tutor" });
    }
};

module.exports = {
    getTutores,
    getTutorById,
    createTutor,
    updateTutor,
    deleteTutor,
};
