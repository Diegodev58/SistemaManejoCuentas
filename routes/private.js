const express = require('express');
const router = express.Router();
const Userautenticado = require('../middlewares/authentication');
const path = require('path');
const login = require('../controllers/validar_user').login;
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');

router.get('/private', Userautenticado, async (req, res) => {
    res.sendFile(path.join(__dirname, '../private', 'index.html'));
});
router.use(express.static(path.join(__dirname, '../private')));

module.exports = router;