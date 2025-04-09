// Importar módulos necesarios
const express = require('express'); // Framework para crear el servidor web
const http = require('http'); // Módulo para crear un servidor HTTP
const socketIo = require('socket.io'); // Módulo para manejar conexiones en tiempo real
const path = require('path'); // Módulo para manejar rutas de archivos
const archiver = require('archiver'); // Módulo para crear archivos zip
const fs = require('fs'); // Módulo para interactuar con el sistema de archivos

// Importar controladores
const usuarioController = require('./controllers/usuarioController'); // Controlador de usuarios
const clienteController = require('./controllers/clienteController'); // Controlador de clientes
const deudaController = require('./controllers/deudacontroller'); // Controlador de deudas
const pagoController = require('./controllers/pagoController'); // Controlador de pagos
const { login } = require('./controllers/validar_user'); // Función de login
const Userautenticado = require('./middlewares/authentication'); // Middleware de autenticación
const cookieParser = require('cookie-parser'); // Middleware para manejar cookies

// Configuración inicial de Express
const router = express.Router(); // Crear un enrutador (aunque no se usa directamente)
const dotenv = require('dotenv'); // Para cargar variables de entorno
dotenv.config(); // Cargar variables de entorno desde .env
const cors = require('cors'); // Middleware para habilitar CORS

// Crear aplicación Express y servidor HTTP
const app = express();
const server = http.createServer(app); // Crear servidor HTTP con la app Express

// Configuración de middleware
app.use(express.json()); // Para parsear JSON en las solicitudes
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios
app.use(cookieParser()); // Para manejar cookies
app.use(cors()); // Habilitar CORS para todas las rutas

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos públicos

// Ruta principal - sirve el login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html')); // Enviar archivo de login
});

// Rutas privadas (requieren autenticación)
app.use('/private', Userautenticado, express.static(path.join(__dirname, 'private'))); // Archivos estáticos privados

// Rutas para archivos específicos en la zona privada
app.use('/private/styles.css', Userautenticado, express.static(path.join(__dirname, 'private'))); // CSS privado
app.use('/private/js', Userautenticado, express.static(path.join(__dirname, 'private', 'js'))); // JS privado

// Rutas para HTML privados
app.get('/private', Userautenticado, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'index.html')); // Página principal privada
});

app.get('/private/index.html/*', Userautenticado, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'index.html')); // Página principal privada
});

app.get('/private/pagos.html/*', Userautenticado, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'pagos.html')); // Página de pagos
});

app.get('/private/registro.html/*', Userautenticado, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'registro.html')); // Página de registro
});

app.get('/private/deudas.html/*', Userautenticado, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'deudas.html')); // Página de deudas
});

app.get('/private/por-cobrar.html/*', Userautenticado, (req, res) => {
  res.sendFile(path.join(__dirname, 'private', 'por-cobrar.html')); // Página por cobrar
});

// Ruta para descargar todos los datos como ZIP
app.get('/data/download-all', (req, res) => {
  const archive = archiver('zip', {
    zlib: { level: 9 } // Máxima compresión
  });

  // Manejo de errores
  archive.on('error', (err) => {
    res.status(500).send({ error: err.message });
  });

  // Configurar respuesta como descarga
  res.attachment('data.zip');
  archive.pipe(res);

  // Leer y agregar archivos JSON al ZIP
  fs.readdir(path.join(__dirname, 'data'), (err, files) => {
    if (err) {
      res.status(500).send({ error: 'Error al leer el directorio data.' });
      return;
    }

    // Agregar cada archivo JSON al ZIP
    files.forEach((file) => {
      if (path.extname(file) === '.json') {
        archive.file(path.join(__dirname, 'data', file), { name: file });
      }
    });

    archive.finalize(); // Finalizar creación del ZIP
  });
});

// Ruta para login
app.post('/login', login); // Manejar solicitudes de login

// Configuración de Socket.IO
const io = socketIo(server); // Crear instancia de Socket.IO

// Manejo de conexiones Socket.IO
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  // USUARIOS
  const usuarios = usuarioController.leerUsuarios();
  socket.emit('usuarios', usuarios); // Enviar lista de usuarios al cliente

  socket.on('nuevoUsuario', (nuevoUsuario) => {
    const usuarioAgregado = usuarioController.agregarUsuario(nuevoUsuario);
    io.emit('nuevoUsuario', usuarioAgregado); // Emitir nuevo usuario a todos
  });

  // Manejar desconexión
  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });

  // CLIENTES
  const clientes = clienteController.leerClientes();
  socket.emit('registro', clientes); // Enviar lista de clientes

  socket.on('nuevoCliente', (nuevoCliente) => {
    let estado;
    const clientes = clienteController.leerClientes();
    const clienteExistente = clientes.find((cliente) => cliente.nombre === nuevoCliente.nombre);
    
    // Validar nuevo cliente
    if (clienteExistente) {
      estado = false;
    } else if (!nuevoCliente.nombre || !nuevoCliente.referencia || !nuevoCliente.fecha) {
      estado = false;
    } else {
      clienteController.agregarClientes(nuevoCliente);
      estado = true;
    }
    io.emit('nuevoCliente', estado); // Notificar estado de operación
  });

  // DEUDAS
  const deudas = deudaController.leerDeudas();
  socket.emit('deudas', deudas); // Enviar lista de deudas

  socket.on('nuevaDeuda', (nuevaDeuda) => {
    if (!nuevaDeuda.nombre || !nuevaDeuda.Articulos || !nuevaDeuda.Cantidad || !nuevaDeuda.precio) {
      return io.emit('nuevoPago', false); // Validación fallida
    } else {
      const clientesExistentes = clienteController.leerClientes();
      const clienteEncontrado = clientesExistentes.find((cliente) => cliente.nombre === nuevaDeuda.nombre);
      
      if(clienteEncontrado){
        const deudaAgregada = deudaController.agregarDeuda(nuevaDeuda);
        return io.emit('nuevaDeuda', true); // Operación exitosa
      }else{
        return io.emit('nuevaDeuda', false); // Cliente no encontrado
      }
    }
  });

  // PAGOS
  socket.emit('clientes', clientes); // Enviar clientes para pagos
  const pagos = pagoController.leerPagos();
  socket.emit('pagos', pagos); // Enviar lista de pagos

  socket.on('nuevoPago', (nuevoPago) => {
    if (!nuevoPago.nombre || !nuevoPago.pago || !nuevoPago.referencia) {
      return io.emit('nuevoPago', false); // Validación fallida
    } else {
      const clientesExistentes = clienteController.leerClientes();
      const clienteEncontrado = clientesExistentes.find((cliente) => cliente.nombre === nuevoPago.nombre);
      
      if(clienteEncontrado){
        const pagoAgregado = pagoController.agregarPago(nuevoPago);
        return io.emit('nuevoPago', true); // Operación exitosa
      }else{
        return io.emit('nuevoPago', false); // Cliente no encontrado
      }
    }
  });

  // DATOS COMPARATIVOS
  const pagostotales = pagoController.leerPagos();
  const deudastotales = deudaController.leerDeudas();
  const clientestotales = clienteController.leerClientes();
  
  const comparacion = {
    pagos: pagostotales,
    deudas: deudastotales,
    clientes: clientestotales
  };
  socket.emit('comparacion', comparacion); // Enviar datos comparativos

  // DATOS PARA GRÁFICOS
  const deudast = deudastotales.map(deuda => parseFloat(deuda.deuda) || 0);
  socket.emit('dartotal', { deuda: deudast }); // Deudas para gráfico

  const pagosNumericos = pagostotales.map(pago => parseFloat(pago.pago) || 0);
  socket.emit('pagost', { pago: pagosNumericos }); // Pagos para gráfico

  // TOTAL DE CLIENTES
  const totalclientes = clientes.length;
  socket.emit('totalclientes', totalclientes); // Enviar conteo de clientes
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});