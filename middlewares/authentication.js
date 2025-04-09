// Importar módulos necesarios
const jwt = require('jsonwebtoken'); // Para trabajar con JSON Web Tokens
require('dotenv').config(); // Para acceder a las variables de entorno

/**
 * Middleware de autenticación que verifica tokens JWT
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 */
async function Userautenticado(req, res, next) {
  try {
    // Obtener el token de dos posibles fuentes:
    // 1. De las cookies (para peticiones desde el navegador)
    // 2. Del header Authorization (para API requests, formato: "Bearer <token>")
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    // Si no hay token, redirigir al inicio (o devolver error 401)
    if (!token) {
      return res.redirect('/'); // Redirección para aplicaciones web
      // Alternativa para APIs: return res.status(401).json({ message: 'Acceso no autorizado: Token no proporcionado' });
    }

    // Verificar el token usando la clave secreta del entorno
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adjuntar la información del usuario decodificada al objeto request
    // para que esté disponible en los siguientes middlewares/rutas
    req.user = decoded;
    
    // Si todo es válido, continuar con el siguiente middleware/ruta
    next();
  } catch (error) {
    // Manejo de errores (token inválido, expirado, etc.)
    res.clearCookie('token'); // Limpiar la cookie si existe
    
    // En caso de error, devolver respuesta no autorizada
    return res.status(401).json({ 
      message: 'Acceso no autorizado: Token inválido o expirado',
      error: error.message // Opcional: incluir detalles del error
    });
  }
}

// Exportar el middleware para su uso en otras partes de la aplicación
module.exports = Userautenticado;