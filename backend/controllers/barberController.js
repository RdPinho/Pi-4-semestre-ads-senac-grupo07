const Barbeiro = require('../models/Barber');

exports.criarBarbeiro = async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    const novo = await Barbeiro.create({ nome, email, telefone });
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao criar barbeiro', error: err.message });
  }
};