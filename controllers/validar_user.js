// Importar módulos necesarios
const fs = require('fs'); // Módulo para operaciones con archivos
const path = require('path'); // Módulo para manejar rutas de archivos
const jwt = require('jsonwebtoken'); // Módulo para trabajar con JWT (JSON Web Tokens)
require('dotenv').config(); // Cargar variables de entorno desde .env

/**
 * Función auxiliar para obtener todos los usuarios registrados
 * @returns {Array} Lista de usuarios desde el archivo JSON
 */
const obtenerUsuarios = () => {
  // Leer el archivo de usuarios de forma síncrona
  const data = fs.readFileSync(path.join(__dirname, '../data/usuarios.json'));
  // Parsear el contenido JSON a objeto JavaScript
  return JSON.parse(data);
};

/**
 * Controlador para el proceso de autenticación (login)
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Promise} Promesa que resuelve con la respuesta HTTP
 */
async function login(req, res) {
  // Extraer email y password del cuerpo de la solicitud
  const { email, password } = req.body;
  
  // Validación básica de campos requeridos
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  // Obtener todos los usuarios registrados
  const usuarios = obtenerUsuarios();
  // Buscar usuario que coincida con credenciales proporcionadas
  const usuario = usuarios.find(user => user.email === email && user.password === password);

  if (usuario) {
    // Si las credenciales son válidas, crear token JWT
    const token = jwt.sign(
      { email }, // Payload (datos a incluir en el token)
      process.env.JWT_SECRET, // Clave secreta desde variables de entorno
      { expiresIn: '1h' } // El token expira en 1 hora
    );
    
    // Configurar cookie HTTP-only para mayor seguridad
    res.cookie('token', token, {
      httpOnly: true, // La cookie no es accesible desde JavaScript
      secure: process.env.NODE_ENV === 'production', // Solo enviar sobre HTTPS en producción
      maxAge: 3600000 // Tiempo de vida de la cookie (1 hora en milisegundos)
    });
    
    // Responder con el token (también está disponible en la cookie)
    res.json({ token });
  } else {
    // Responder con error 401 si las credenciales son inválidas
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
}

// Nota: La función para validar tokens mencionada en el comentario no está implementada aún
// Esto podría ser un middleware para proteger rutas en el futuro

// Exportar solo la función login (patrón común para controladores)
module.exports = { login };