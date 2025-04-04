// Importar módulos necesarios
const express = require('express'); // Framework para crear el servidor web
const http = require('http'); // Módulo para crear un servidor HTTP
const socketIo = require('socket.io'); // Módulo para manejar conexiones en tiempo real
const path = require('path'); // Módulo para manejar rutas de archivos

// Importar el controlador de usuarios (archivo: controllers/usuarioController.js)
const usuarioController = require('./controllers/usuarioController');
// Inportar el controlador de clientes (archivo: controllers/clienteController.js)
const clienteController = require('./controllers/clienteController');
// Importar el controlador de deudas (archivo: controllers/deudaController.js)
const deudaController = require('./controllers/deudacontroller');
// Importar el controlador de pagos (archivo: controllers/pagoController.js)
const pagoController = require('./controllers/pagoController');
// Importar el controlador de autenticación (archivo: controllers/validar_user.js)
const { login } = require('./controllers/validar_user');
const Userautenticado = require('./middlewares/authentication');
const cookieParser = require('cookie-parser');
require('express');
// routes
const router = express.Router();

const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

// Crear una instancia de Express y un servidor HTTP
const app = express();

// Configuraciones básicas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Archivos públicos (sin autenticación)
// Configuraciones básicas (CORREGIDO)


// Archivos públicos (sin autenticación)


app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


// Ruta privada con autenticación
app.use('/private', Userautenticado, express.static(path.join(__dirname, 'private')));

// Ruta para servir el index.html privado
app.get('/private', Userautenticado, (req, res) => {
    res.sendFile(path.join(__dirname, 'private', 'index.html'));
});

app.get('/private/index.html', Userautenticado, (req, res) => {
    res.sendFile(path.join(__dirname, 'private', 'index.html'));
});

app.get('/private/pagos.html/*', Userautenticado, (req, res) => {
    res.sendFile(path.join(__dirname, 'private', 'pagos.html'));
});

app.get('/private/registro.html/*', Userautenticado, (req, res) => {
    res.sendFile(path.join(__dirname, 'private', 'registro.html'));
}
);
app.get('/private/deudas.html/*', Userautenticado, (req, res) => {
    res.sendFile(path.join(__dirname, 'private', 'deudas.html'));
});

app.get('/private/por-cobrar.html/*', Userautenticado, (req, res) => {
    res.sendFile(path.join(__dirname, 'private', 'por-cobrar.html'));
});





// Otras rutas...
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', login);




// Manejar conexiones de Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    // Obtener la lista de usuarios usando la función 'leerUsuarios' del controlador
    const usuarios = usuarioController.leerUsuarios();

    // Enviar la lista de usuarios al cliente que se acaba de conectar
    socket.emit('usuarios', usuarios);

    // Escuchar el evento 'nuevoUsuario' desde el cliente
    socket.on('nuevoUsuario', (nuevoUsuario) => {
        const usuarioAgregado = usuarioController.agregarUsuario(nuevoUsuario);
        io.emit('nuevoUsuario', usuarioAgregado);
    });

    // Manejar la desconexión de un cliente
    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
    });

    // Parte de clientes
    const clientes = clienteController.leerClientes();
    socket.emit('registro', clientes);

    socket.on('nuevoCliente', (nuevoCliente) => {
        let estado;
        const clientes = clienteController.leerClientes();
        const clienteExistente = clientes.find((cliente) => cliente.nombre === nuevoCliente.nombre);
        if (clienteExistente) {
            estado = false;
        } else if (!nuevoCliente.nombre || !nuevoCliente.referencia || !nuevoCliente.fecha) {
            estado = false;
        } else {
            clienteController.agregarClientes(nuevoCliente);
            estado = true;
        }
        io.emit('nuevoCliente', estado);
    });

    // Parte de deudas
    const deudas = deudaController.leerDeudas();
    socket.emit('deudas', deudas);

    socket.on('nuevaDeuda', (nuevaDeuda) => {
        let estado;
        if (!nuevaDeuda.nombre || !nuevaDeuda.Articulos || !nuevaDeuda.Cantidad || !nuevaDeuda.precio) {
            estado = false;
        } else {
            const deudaAgregada = deudaController.agregarDeuda(nuevaDeuda);
            io.emit('nuevaDeuda', deudaAgregada);
            estado = true;
        }
        io.emit('nuevaDeuda', estado);
    });

    // Parte de pagos
    socket.emit('clientes', clientes);
    const pagos = pagoController.leerPagos();
    socket.emit('pagos', pagos);

    socket.on('nuevoPago', (nuevoPago) => {
        let estado;
        if (!nuevoPago.nombre || !nuevoPago.pago || !nuevoPago.referencia) {
            estado = false;
        } else {
            const pagoAgregado = pagoController.agregarPago(nuevoPago);
            io.emit('nuevoPago', pagoAgregado);
            estado = true;
        }
        io.emit('nuevoPago', estado);
    });

    // Comparación de datos
    const pagostotales = pagoController.leerPagos();
    const deudastotales = deudaController.leerDeudas();
    const clientestotales = clienteController.leerClientes();
    const comparacion = {
        pagos: pagostotales,
        deudas: deudastotales,
        clientes: clientestotales
    };
    socket.emit('comparacion', comparacion);
});





// Definir la ruta para la página principal


// Definir el puerto en el que correrá el servidor
const PORT = process.env.PORT || 3000;

//elementos static

//



   


// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});