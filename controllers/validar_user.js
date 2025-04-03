const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const obtenerUsuarios = () => {
  const data = fs.readFileSync(path.join(__dirname, '../data/usuarios.json'));
  return JSON.parse(data);
};

async function login(req, res) {
  const { email, password } = req.body;
  
  // Validar que vengan ambos campos
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(user => user.email === email && user.password === password);

  if (usuario) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Configurar la cookie HTTP-only para mayor seguridad
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000 // 1 hora en ms
    });
    
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
}

// vamos a crear una funcion para validar el token y para dar acceso a las rutas protegidas


module.exports = { login };