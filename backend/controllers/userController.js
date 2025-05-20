const User = require('../models/User');
const jwt = require('jsonwebtoken');

const gerarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const existe = await User.findOne({ email });
        if (existe) return res.status(400).json({ msg: 'Usuário já existe' });

        const novoUsuario = await User.create({ nome, email, senha });
        res.status(201).json({ 
            token: gerarToken(novoUsuario._id),
            usuario: { id: novoUsuario._id, nome: novoUsuario.nome, email: novoUsuario.email }
        });
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await User.findOne({ email });
        if (!usuario || !(await usuario.comparePassword(senha))) {
            return res.status(400).json({ msg: 'Credenciais inválidas' });
        }
        res.json({ 
            token: gerarToken(usuario._id),
            usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email }
        });
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor' });
    }
};
