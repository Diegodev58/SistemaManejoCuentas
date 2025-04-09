// Importar módulos necesarios para manejo de archivos y rutas
const fs = require('fs'); // Módulo para operaciones con el sistema de archivos
const path = require('path'); // Módulo para manejar rutas de archivos

// Definir la ruta del archivo JSON donde se almacenan los clientes
// Usa path.join para crear una ruta compatible con cualquier sistema operativo
const clientesPath = path.join(__dirname, '..', 'data', 'clientes.json');

/**
 * Función para leer todos los clientes del archivo JSON
 * @returns {Array} Lista de clientes o array vacío si hay error
 */
const leerClientes = () => {
    try {
        // Leer el archivo de forma síncrona con codificación UTF-8
        const data = fs.readFileSync(clientesPath, 'utf8');
        // Convertir el contenido JSON a objeto JavaScript
        return JSON.parse(data);
    } catch (err) {
        // Manejar errores (archivo no existe, formato inválido, etc.)
        console.error('Error leyendo el archivo de clientes:', err);
        return []; // Devolver array vacío en caso de error
    }
};

/**
 * Función para guardar la lista de clientes en el archivo JSON
 * @param {Array} clientes - Lista de clientes a guardar
 */
const guardarClientes = (clientes) => {
    try {
        // Convertir el array a JSON con formato legible (2 espacios de indentación)
        fs.writeFileSync(clientesPath, JSON.stringify(clientes, null, 2));
    } catch (err) {
        // Manejar errores de escritura (permisos, disco lleno, etc.)
        console.error('Error guardando el archivo de clientes:', err);
    }
};

/**
 * Función para agregar un nuevo cliente
 * @param {Object} nuevoCliente - Objeto con los datos del nuevo cliente
 * @returns {Object} El cliente recién agregado
 */
const agregarClientes = (nuevoCliente) => {
    // Obtener la lista actual de clientes
    const clientes = leerClientes();
    // Agregar el nuevo cliente al array
    clientes.push(nuevoCliente);
    // Guardar la lista actualizada
    guardarClientes(clientes);
    // Devolver el cliente agregado
    return nuevoCliente;
};

/**
 * Función para eliminar un cliente por su nombre
 * @param {string} nombre - Nombre del cliente a eliminar
 * @returns {Object|null} El cliente eliminado o null si no se encontró
 */
const eliminarCliente = (nombre) => {
    // Obtener la lista actual de clientes
    const clientes = leerClientes();
    // Buscar el cliente por su nombre
    const cliente = clientes.find((cliente) => cliente.nombre === nombre);
    
    if (cliente) {
        // Filtrar para obtener todos los clientes excepto el eliminado
        const nuevosClientes = clientes.filter((cliente) => cliente.nombre !== nombre);
        // Guardar la lista actualizada
        guardarClientes(nuevosClientes);
        // Devolver el cliente eliminado
        return cliente;
    }
    // Si no se encontró el cliente, devolver null
    return null;
};

// Exportar las funciones para su uso en otros módulos
module.exports = {
    leerClientes,    // Para obtener la lista de clientes
    guardarClientes, // Para guardar la lista de clientes (útil para operaciones batch)
    agregarClientes, // Para agregar un nuevo cliente
    eliminarCliente, // Para eliminar un cliente existente
};