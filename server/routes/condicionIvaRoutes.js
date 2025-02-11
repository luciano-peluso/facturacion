const express = require('express');
const { getCondicionesIva, getCondicionIva } = require('../controllers/condicionIvaController');

const router = express.Router();

// Endpoints
router.get('/', getCondicionesIva);
router.get('/:id', getCondicionIva);

module.exports = router;