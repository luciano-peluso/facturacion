const express = require('express');
const { getFacturas, getFacturaById, createFactura, updateFactura, deleteFactura } = require('../controllers/facturaController');

const router = express.Router();

// Endpoints
router.get('/', getFacturas);
router.get('/:id', getFacturaById);
router.post('/', createFactura);
router.put('/actualizar/:id', updateFactura);
router.delete('/borrar/:id', deleteFactura);

module.exports = router;