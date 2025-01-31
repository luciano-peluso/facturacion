const express = require('express');
const { getFacturas, getFacturaById, createFactura, updateFactura, deleteFactura, obtenerFacturasPorMes } = require('../controllers/facturaController');

const router = express.Router();

// Endpoints
router.get('/', getFacturas);
router.get('/:id', getFacturaById);
router.post('/', createFactura);
router.put('/actualizar/:id', updateFactura);
router.delete('/borrar/:id', deleteFactura);
router.get('/mes/:mes/:anio', obtenerFacturasPorMes);

module.exports = router;