const ObraSocial = require('../models/ObraSocial');
const Paciente = require('../models/Paciente');
const PacienteObraSocial = require('../models/PacienteObraSocial');


const getPacienteObraSocial = async (req, res) => {
    try {   
        const pacienteObraSocial = await PacienteObraSocial.findAll({
            paranoid: true,
            include: [
                {
                    model: Paciente,
                    foreignKey: 'paciente_id',
                    attributes: ['id', 'nombre']
                },
                {
                    model: ObraSocial,
                    foreignKey: "obra_social_id",
                    attributes: ['nombre']
                }
            ]
        });
        res.status(200).json({
            success: true,
            message: "La relacion entre pacientes y obra social fue traida con exito.",
            data: pacienteObraSocial
        })
    } catch (error) {
        console.error("Error al traer la relacion entre pacientes y obra social");
        res.status(500).json({ success: false, message: "Error al traer la relacion entre pacientes y obra social" });
    }
}

const getObraSocialByPacienteId = async (req, res) => {
    const { id } = req.params;
    try {
        const obrasSociales = await PacienteObraSocial.findAll({
            where: {
                'paciente_id': id
            },
            paranoid: true,
            include: [{
                model: ObraSocial,
                foreignKey: 'obra_social_id',
                attributes: ['nombre']
            }]
        })
        res.status(200).json({
            success: true,
            message: "Las obras sociales del paciente fueron traidas con éxito",
            data: obrasSociales
        })
    } catch (error) {
        console.error("Error al traer la relacion entre pacientes y obra social");
        res.status(500).json({ success: false, message: "Error al traer la relacion entre pacientes y obra social" });
    }
}

const createPacienteObraSocial = async (req, res) => {
    const { paciente_id, obra_social_id } = req.body;
    try {
        const pacienteObraSocial = await PacienteObraSocial.create({paciente_id, obra_social_id: obra_social_id || null});
        res.status(201).json({success: true, message: "Éxito al crear la relación entre paciente y obra social", data: pacienteObraSocial});
    } catch (error) {
        console.error("Error al crear la relacion entre pacientes y obra social");
        res.status(500).json({ success: false, message: "Error al crear la relacion entre pacientes y obra social", data: error });
    }
}

const updatePacienteObraSocial = async (req, res) => {
    const {paciente_id, obra_social_id, obra_social_id_nueva} = req.body;
    try {
        const pacienteObraSocial = await PacienteObraSocial.findOne({
            where: {
                "paciente_id": paciente_id,
                "obra_social_id": obra_social_id
            },
            paranoid: true
        });
        await pacienteObraSocial.update({paciente_id, obra_social_id: obra_social_id_nueva});
        res.status(200).json({ success: true, message: "Relacion actualizada", data: pacienteObraSocial });
    } catch (error) {
        console.error("Error al crear la relacion entre pacientes y obra social");
        res.status(500).json({ success: false, message: "Error al crear la relacion entre pacientes y obra social", data: error });
    }
}

const deletePacienteObraSocial = async (req, res) => {
    const { paciente_id, obra_social_id } = req.body;
    try {
        const pacienteObraSocial = await PacienteObraSocial.findOne({
            where: {
                "paciente_id": paciente_id,
                "obra_social_id": obra_social_id
            },
            paranoid: true
        });
        if (!pacienteObraSocial) {
            return res.status(404).json({ success: false, message: "Relación paciente-obrasocial no encontrada" });
        }

        await pacienteObraSocial.destroy();
        res.status(200).json({ success: true, message: "Se eliminó con éxito la relación entre el paciente y la obra social", data: pacienteObraSocial});
    } catch (error) {
        console.error("Error al eliminar la relacion entre pacientes y obra social");
        res.status(500).json({ success: false, message: "Error al eliminar la relacion entre pacientes y obra social", data: error });
    }
}

module.exports = {
    getPacienteObraSocial,
    getObraSocialByPacienteId,
    createPacienteObraSocial,
    updatePacienteObraSocial,
    deletePacienteObraSocial
}