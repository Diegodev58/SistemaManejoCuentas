const mongoose = require('mongoose');

const deudaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  articulos: {  // Nota: Cambié "Articulos" a minúscula para consistencia
    type: String,
    required: true
  },
  cantidad: {   // Nota: Cambié "Cantidad" a minúscula
    type: Number,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  deuda: {
    type: Number,
    required: true
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

module.exports = mongoose.model('Deuda', deudaSchema);