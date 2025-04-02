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
const { login } = require('./controllers/validar_user.js');

const cookieParser = require('cookie-parser');
require('express');


const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

// Crear una instancia de Express y un servidor HTTP
const app = express();
const server = http.createServer(app);

// Inicializar Socket.IO y vincularlo al servidor HTTP
const io = socketIo(server);

app.use(express.json()); // Permite parsear JSON en las solicitudes (middleware integrado de Express)
app.use(cookieParser()) 
// Configurar Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));


app.use(cors()); // Habilitar CORS
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
} );
//app.post("/login",login,); 
app.post("/login", async(req, res) => {
    const { email, password } = req.body;
    console.log("Datos recibidos:", email, password);
    res.json({ mensaje: "Login exitoso" }); // ¡Importante enviar una respuesta!
  });





// Manejar conexiones de Socket.IO
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    // Obtener la lista de usuarios usando la función 'leerUsuarios' del controlador
    // (Definida en: controllers/usuarioController.js)
    const usuarios = usuarioController.leerUsuarios();

    // Enviar la lista de usuarios al cliente que se acaba de conectar
    // (El cliente escucha este evento en: public/script.js)
    socket.emit('usuarios', usuarios);

    // Escuchar el evento 'nuevoUsuario' desde el cliente
    // (El cliente emite este evento en: public/script.js)
    socket.on('nuevoUsuario', (nuevoUsuario) => {
        // Agregar el nuevo usuario usando la función 'agregarUsuario' del controlador
        // (Definida en: controllers/usuarioController.js)
        const usuarioAgregado = usuarioController.agregarUsuario(nuevoUsuario);

        // Emitir el nuevo usuario a todos los clientes conectados
        // (Los clientes escuchan este evento en: public/script.js)
        io.emit('nuevoUsuario', usuarioAgregado);
    });

    // Manejar la desconexión de un cliente
    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
    });


    // Obtener la lista de clientes usando la función 'leerClientes' del controlador
    // (Definida en: controllers/clienteController.js)
    

    // Enviar la lista de clientes al cliente que se acaba de conectar
    // (El cliente escucha este evento en: public/script.js)
     
    // Escuchar el user y password desde el cliente para el login
    socket.on('enviarComprobar', (enviarComprobar) => {
        function verificarAdmin(email, password) {
            const admin = login(email, password);
        }
        verificarAdmin(enviarComprobar.email, enviarComprobar.password);
        module.exports = {
            verificarAdmin
        }
    })  


    /**
     * Parte de clientes
     */
    // mostrar los clientes
   const clientes = clienteController.leerClientes();
    socket.emit('registro', clientes);
    // Escuchar el evento 'registro' desde el cliente
    // (El cliente emite este evento en: public/script.js)
    // Enviar la lista de clientes al cliente que se acaba de con
    //guectar 


    //guar el cliente
    socket.on('nuevoCliente', (nuevoCliente) => {
        let estado;
        // Agregar el nuevo cliente usando la función 'agregarCliente' del controlador
        // (Definida en: controllers/clienteController.js)
        //verificar si el cliente ya existe
        const clientes = clienteController.leerClientes();
        const clienteExistente = clientes.find((cliente) => cliente.nombre === nuevoCliente.nombre);
        if (clienteExistente) {
            console.log('El cliente ya existe:', clienteExistente);
            estado = false;
            io.emit('nuevoCliente', estado);
            return;
        }
        //verificar si el cliente tiene todos los datos
        if (!nuevoCliente.nombre || !nuevoCliente.referencia || !nuevoCliente.fecha) {
            console.log('Faltan datos del cliente:', nuevoCliente);
            const clienteAgregado = clienteController.agregarClientes(nuevoCliente);
            console.log('Nuevo cliente agregado:', clienteAgregado);
            estado = false;
        } else {
            console.log('Todos los datos del cliente:', nuevoCliente);
            const clienteAgregado = clienteController.agregarClientes(nuevoCliente);
            console.log('Nuevo cliente agregado:', clienteAgregado);
            estado = true;
            
        }
        io.emit('nuevoCliente', estado);
        // Emitir el nuevo cliente a todos los clientes conectados
        // (Los clientes escuchan este evento en: public/script.js)
        //io.emit('nuevoCliente', clienteAgregado);
    });

    /**
     * Parte de deudas
     */

    // Emite las deudas al cliente
    const deudas = deudaController.leerDeudas();
    socket.emit('deudas', deudas);

    // Escuchar el evento 'nuevaDeuda' desde el cliente
    // (El cliente emite este evento en: public/script.js)
    socket.on('nuevaDeuda', (nuevaDeuda) => {
        let estado;
        // Verificar si la deuda tiene todos los datos necesarios
        function verificarDeuda (nuevaDeuda) {
            if (!nuevaDeuda.nombre || !nuevaDeuda.Articulos || !nuevaDeuda.Cantidad || !nuevaDeuda.precio) {
                console.log('Faltan datos de la deuda:', nuevaDeuda);
                estado = false;
                return;
            }else {
                console.log('Todos los datos de la deuda:', nuevaDeuda);
                estado = true;
                  // Agregar la nueva deuda usando la función 'agregarDeudas' del controlador
                // (Definida en: controllers/deudaController.js)
                const deudaAgregada = deudaController.agregarDeuda(nuevaDeuda);
                console.log('Nueva deuda agregada:', deudaAgregada);
                // Emitir la nueva deuda a todos los clientes conectados
                // (Los clientes escuchan este evento en: public/script.js)
                io.emit('nuevaDeuda', deudaAgregada);
                return true;
            }

        }
        // Verificar la deuda
        verificarDeuda(nuevaDeuda);
        io.emit('nuevaDeuda', estado);


      
    })


    // emitir cleintes al cliente
    
    /** 
     * Parte de pagos
     */
    // emite los clientes al cliente
    socket.emit('clientes', clientes);
    // Emite los pagos al cliente
    const pagos = pagoController.leerPagos();
    socket.emit('pagos', pagos);

    // Escuchar el evento 'nuevoPago' desde el cliente
    // (El cliente emite este evento en: public/script.js)
    socket.on('nuevoPago', (nuevoPago) => {
        let estado;
    
        // Verificar si el pago tiene todos los datos necesarios
        function verificarPago (nuevoPago) {
            if (!nuevoPago.nombre || !nuevoPago.pago || !nuevoPago.referencia) { // Cambiar cliente y monto por nombre y pago
                console.log('Faltan datos del pago:', nuevoPago);
                estado = false;
                return false; // Devolver false para indicar error
            } else {
                console.log('Todos los datos del pago:', nuevoPago);
                estado = true;
                return true; // Devolver true para indicar éxito
            }
        }
    
        // Verificar el pago
        if (verificarPago(nuevoPago)) { // Usar el valor de retorno de verificarPago
            // Agregar el nuevo pago usando la función 'agregarPago' del controlador
            const pagoAgregado = pagoController.agregarPago(nuevoPago);
            console.log('Nuevo pago agregado:', pagoAgregado);
            // Emitir el nuevo pago a todos los clientes conectados
            io.emit('nuevoPago', pagoAgregado);
        }
    
        io.emit('nuevoPago', estado);
    });
        // Agregar el nuevo pago usando la función 'agregarPago' del controlador
        // (Definida en: controllers/pagoController.js)
        


    //*** Parte de la tabla **/
    // Escuchar el evento 'nuevoPago' desde el cliente
    // (El cliente emite este evento en: public/script.js)
    const pagostotales = pagoController.leerPagos();
    const deudastotales = deudaController.leerDeudas();
    const clientestotales = clienteController.leerClientes();
    const comparacion = {
        pagos: pagostotales,
        deudas: deudastotales,
        clientes: clientestotales
    };
    socket.emit('comparacion', comparacion);
    



    })





// Definir la ruta para la página principal


// Definir el puerto en el que correrá el servidor
const PORT = process.env.PORT || 3000;

//elementos static

//



   


// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});