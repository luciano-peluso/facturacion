const express = require('express');
const { getPacientes, getPacienteById, createPaciente, updatePaciente, deletePaciente } = require('../controllers/pacienteController');

const router = express.Router();

// Endpoints
router.get('/', getPacientes);
router.get('/:id', getPacienteById);
router.post('/', createPaciente);
router.put('/actualizar/:id', updatePaciente);
router.delete('/borrar/:id', deletePaciente);

module.exports = router;