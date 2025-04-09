const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  pago: {
    type: Number,
    required: true
  },
  fecha: {
    type: String,
    required: true
  },
  referencia: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    default: "pago"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pago', pagoSchema);