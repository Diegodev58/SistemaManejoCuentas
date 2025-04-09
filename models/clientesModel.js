const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  referencia: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  direccion: {  // Nota: Corregí "dirreccion" a "direccion"
    type: String,
    default: ""
  },
  fecha: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cliente', clienteSchema);