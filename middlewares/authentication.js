const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { login } = require('../controllers/validar_user.js');
dotenv = require('dotenv');


dotenv.config();

function soloAdmin(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    // Verifica si el usuario es administrador
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para acceder a esta ruta' });
    }
    next();
    return res.redirect("/private/pagos"); // Redirige a la ruta privada si el token es válido y el usuario es admin
  });
}
// Middleware para verificar el token de autenticación
function verificarToken(req, res, next) {
  const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'Token no proporcionado' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        req.user = decoded; // Almacena la información del usuario en la solicitud
        next();
    });
}

module.exports = {
    soloAdmin,
    verificarToken
};