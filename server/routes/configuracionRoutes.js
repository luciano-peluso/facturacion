const express = require('express');
const { getConfiguracion, createConfiguracion, updateConfiguracion, deleteConfiguracion } = require('../controllers/configuracionController');

const router = express.Router();

// Endpoints
router.get('/', getConfiguracion);
router.post('/', createConfiguracion);
router.put('/actualizar/:id', updateConfiguracion);
router.delete('/borrar/:id', deleteConfiguracion);

module.exports = router;