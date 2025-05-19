const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.proteger = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Sem token' });

    try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodificado.id).select('-senha');
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token inválido' });
    }
};
