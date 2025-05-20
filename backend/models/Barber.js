const mongoose = require('mongoose');

const BarbeiroSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefone: { type: String, required: true }
});

module.exports = mongoose.model('Barber', BarbeiroSchema);