const express = require('express');
const { getPacienteObraSocial, getObraSocialByPacienteId, createPacienteObraSocial, updatePacienteObraSocial, deletePacienteObraSocial } = require('../controllers/pacienteObraSocialController');

const router = express.Router();

// Endpoints
router.get('/', getPacienteObraSocial);
router.get('/:id', getObraSocialByPacienteId);
router.post('/', createPacienteObraSocial);
router.put('/actualizar/', updatePacienteObraSocial);
router.delete('/borrar/', deletePacienteObraSocial);

module.exports = router;