const express = require('express');
const { getTutores, getTutorById, createTutor, updateTutor, deleteTutor } = require('../controllers/tutorController');

const router = express.Router();

// Endpoints
router.get('/', getTutores);
router.get('/:id', getTutorById);
router.post('/', createTutor);
router.put('/actualizar/:id', updateTutor);
router.delete('/borrar/:id', deleteTutor);

module.exports = router;