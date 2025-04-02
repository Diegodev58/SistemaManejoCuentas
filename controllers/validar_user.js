const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
dotenv = require('dotenv');
dotenv.config();
const {verificarAdmin} = require('../server.js');
const e = require('express');

// obtener el email y la contraseña del json
const obtenerUsuarios = () => {
  const data = fs.readFileSync(path.join(__dirname, '../data/usuarios.json'));
  return JSON.parse(data);
};

async function login(req, res) {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
}
module.exports = { login };
//obtener el email y la contraseña del formulario

