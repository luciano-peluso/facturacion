const express = require('express');
const { getNotificaciones, marcarComoLeida, deleteNotificacion } = require('../controllers/notificacionController');

const router = express.Router();

// Endpoints
router.get('/', getNotificaciones);
router.put('/actualizar/:id', marcarComoLeida);
router.delete('/borrar/:id', deleteNotificacion);

module.exports = router;