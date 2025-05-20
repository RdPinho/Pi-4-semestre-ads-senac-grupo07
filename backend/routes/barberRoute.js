const express = require('express');
const router = express.Router();
const barberController = require('../controllers/barberController');
const { proteger } = require('../middlewares/authMiddleware');
const { listarTodosAgendamentos } = require('../controllers/appointmentController');

router.post('/', barberController.criarBarbeiro);
router.get('/todos', proteger, listarTodosAgendamentos);

module.exports = router;