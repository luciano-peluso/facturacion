const express = require('express');
const { getObrasSociales, getObraSocialById, createObraSocial, updateObraSocial, deleteObraSocial } = require('../controllers/obraSocialController');

const router = express.Router();

// Endpoints
router.get('/', getObrasSociales);
router.get('/:id', getObraSocialById);
router.post('/', createObraSocial);
router.put('/actualizar/:id', updateObraSocial);
router.delete('/borrar/:id', deleteObraSocial);

module.exports = router;