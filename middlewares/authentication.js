const jwt = require('jsonwebtoken');
require('dotenv').config();

async function Userautenticado(req, res, next) {
  try {
    // Obtener el token de las cookies o del header Authorization
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
       return res.redirect('/')
      //return res.status(401).json({ message: 'Acceso no autorizado: Token no proporcionado' });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    // Token válido, continuar
    next();
  } catch (error) {
    // Token inválido o expirado
    res.clearCookie('token');
    return res.status(401).json({ message: 'Acceso no autorizado: Token inválido o expirado' });
  }
}


module.exports = Userautenticado;
