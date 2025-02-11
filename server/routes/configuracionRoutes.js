const express = require('express');
const { getConfiguracion, createConfiguracion, updateConfiguracion, deleteConfiguracion, getConfiguracionAfip } = require('../controllers/configuracionController');

const router = express.Router();

// Endpoints
router.get('/', getConfiguracion);
router.get('/afip', getConfiguracionAfip);
router.post('/', createConfiguracion);
router.put('/actualizar', updateConfiguracion);
router.delete('/borrar', deleteConfiguracion);

module.exports = router;