const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    barbeiro: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    data: { type: Date, required: true },
    servico: { type: String, required: true },
    status: { type: String, enum: ['pendente', 'confirmado', 'cancelado'], default: 'pendente' }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
