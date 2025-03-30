// Importar el módulo 'fs' para manejar archivos
const fs = require('fs');
const path = require('path');

// Definir la ruta del archivo JSON de usuarios
// (El archivo se encuentra en: data/usuarios.json)
const usuariosPath = path.join(__dirname, '..', 'data', 'pagos.json');

// leer los pagos desde el archivo JSON
const leerPagos = () => {
    try {
        // Leer el archivo JSON (ubicado en: data/usuarios.json)
        const data = fs.readFileSync(usuariosPath, 'utf8');

        // Convertir el contenido del archivo JSON a un array de usuarios
        return JSON.parse(data);
    } catch (err) {
        console.error('Error leyendo el archivo de usuarios:', err);
        return []; // Retornar un array vacío en caso de error
    }
};

// Función para guardar los pagos en el archivo JSON
const guardarPagos = (pagos) => {
    try {
        // Convertir el array de usuarios a formato JSON y guardarlo en el archivo
        fs.writeFileSync(usuariosPath, JSON.stringify(pagos, null, 2));
    } catch (err) {
        console.error('Error guardando el archivo de usuarios:', err);
    }
}

// Función para agregar un nuevo pago
const agregarPago = (nuevoPago) => {
    // Obtener la lista actual de pagos usando la función 'leerPagos'
    const pagos = leerPagos();

    // Agregar el nuevo pago al array
    pagos.push(nuevoPago);

    // Guardar el array actualizado en el archivo JSON usando la función 'guardarPagos'
    guardarPagos(pagos);

    // Retornar el pago agregado (esto se usa en server.js para emitir el nuevo usuario)
    return nuevoPago;
}
// Función para eliminar un pago


module.exports = {
    leerPagos,
    agregarPago,
    guardarPagos
};