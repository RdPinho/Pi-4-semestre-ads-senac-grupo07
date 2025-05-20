const Appointment = require('../models/Appointment');

exports.criarAgendamento = async (req, res) => {
    try {
        const { barbeiro, data, servico } = req.body;
        const novo = await Appointment.create({
            cliente: req.user.id,
            barbeiro,
            data,
            servico
        });
        res.status(201).json(novo);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao criar agendamento', error: err.message });
    }
};

exports.listarAgendamentosCliente = async (req, res) => {
    const agendamentos = await Appointment.find({ cliente: req.user.id }).populate('barbeiro', 'nome');
    res.json(agendamentos);
};

exports.listarTodosAgendamentos = async (req, res) => {
    try {
        const agendamentos = await Appointment.find()
            .populate('barbeiro', 'nome')
            .populate('cliente', 'nome');
        res.json(agendamentos);
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao buscar agendamentos', error: err.message });
    }
};