const express = require('express');
const { criarAgendamento, listarAgendamentosCliente, listarTodosAgendamentos } = require('../controllers/appointmentController');
const { proteger } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', proteger, criarAgendamento);
router.get('/agendamento-cliente', proteger, listarAgendamentosCliente);
router.get('/todos', proteger, listarTodosAgendamentos);

module.exports = router;
