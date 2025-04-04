const path = require('path');
const login = require('../controllers/validar_user').login;
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('public/login.html');
});

router.post('/login', login);

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
});
