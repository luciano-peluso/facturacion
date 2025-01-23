const Paciente = require('../models/Paciente');

const getPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.findAll({ paranoid:true }); 
        res.status(200).json({success: true, message:"Pacientes traidos con éxito", data: pacientes});
    } catch (error) {
        console.error("Error al traer los pacientes: ", error);
        res.status(500).json({success: false, message: "Error al traer los pacientes."});
    }
}

const getPacienteById = async (req, res) => {
    const { id } = req.params;
    try {
        const paciente = await Paciente.findByPk(id);
        if (!paciente) {
            return res.status(404).json({ success: false, message: "Paciente no encontrado" });
        }
        res.status(200).json({ success: true, data: paciente });
    } catch (error) {
        console.error("Error al traer el paciente:", error);
        res.status(500).json({ success: false, message: "Error al traer el paciente" });
    }
};

const createPaciente = async (req, res) => {
    const { nombre, dni, obra_social_id, tutor_id } = req.body;
    try {
        const paciente = await Paciente.create({ nombre, dni, obra_social_id, tutor_id });
        res.status(201).json({ success: true, message: "Paciente creado", data: paciente });
    } catch (error) {
        console.error("Error al crear el paciente:", error);
        res.status(500).json({ success: false, message: "Error al crear el paciente" });
    }
};

const updatePaciente = async (req, res) => {
    const { id } = req.params;
    const { nombre, dni, obra_social_id, tutor_id } = req.body;
    try {
        const paciente = await Paciente.findByPk(id);
        if (!paciente) {
            return res.status(404).json({ success: false, message: "Paciente no encontrado" });
        }
        await paciente.update({ nombre, dni, obra_social_id, tutor_id });
        res.status(200).json({ success: true, message: "Paciente actualizado", data: paciente });
    } catch (error) {
        console.error("Error al actualizar el paciente:", error);
        res.status(500).json({ success: false, message: "Error al actualizar el paciente" });
    }
};

const deletePaciente = async (req, res) => {
    const { id } = req.params;
    try {
        const paciente = await Paciente.findByPk(id);
        if (!paciente) {
            return res.status(404).json({ success: false, message: "Paciente no encontrado" });
        }
        await paciente.destroy();
        res.status(200).json({ success: true, message: "Paciente eliminado" });
    } catch (error) {
        console.error("Error al eliminar el paciente:", error);
        res.status(500).json({ success: false, message: "Error al eliminar el paciente" });
    }
};

module.exports = {
    getPacientes,
    getPacienteById,
    createPaciente,
    updatePaciente,
    deletePaciente,
};
