// Importar los módulos necesarios para el manejo de archivos y rutas
const fs = require('fs'); // Módulo para operaciones con el sistema de archivos
const path = require('path'); // Módulo para manejar rutas de directorios y archivos

// Definir la ruta completa al archivo JSON que almacena las deudas
// path.join() crea una ruta compatible con cualquier sistema operativo
const deudasPath = path.join(__dirname, '..', 'data', 'deudas.json');

/**
 * Función para leer todas las deudas almacenadas en el archivo JSON
 * @returns {Array} Lista de deudas o array vacío si hay error o el archivo no existe
 */
const leerDeudas = () => {
    try {
        // Leer el archivo de forma síncrona con codificación UTF-8
        const data = fs.readFileSync(deudasPath, 'utf8');
        // Convertir el contenido JSON a un objeto JavaScript
        return JSON.parse(data);
    } catch (err) {
        // Manejar errores (archivo no encontrado, formato inválido, etc.)
        console.error('Error leyendo el archivo de deudas:', err);
        // Devolver un array vacío como valor por defecto
        return [];
    }
}

/**
 * Función para guardar la lista de deudas en el archivo JSON
 * @param {Array} deudas - Lista de deudas a guardar
 */
const guardarDeudas = (deudas) => {
    try {
        // Convertir el array de deudas a formato JSON con indentación (2 espacios)
        // para mejor legibilidad del archivo
        fs.writeFileSync(deudasPath, JSON.stringify(deudas, null, 2));
    } catch (err) {
        // Manejar errores de escritura (permisos, disco lleno, etc.)
        console.error('Error guardando el archivo de deudas:', err);
    }
}

/**
 * Función para agregar una nueva deuda al registro
 * @param {Object} deuda - Objeto que representa la nueva deuda a agregar
 * La deuda debe contener propiedades como nombre, monto, fecha, etc.
 */
const agregarDeuda = (deuda) => {
    // Obtener el listado actual de deudas
    const deudas = leerDeudas();
    // Agregar la nueva deuda al array
    deudas.push(deuda);
    // Guardar el array actualizado en el archivo
    guardarDeudas(deudas);
    // Nota: Esta función no devuelve nada (void)
}

// Exportar las funciones para que puedan ser utilizadas desde otros módulos
module.exports = {
    leerDeudas,   // Para obtener el listado completo de deudas
    guardarDeudas, // Para guardar manualmente el listado de deudas
    agregarDeuda   // Para agregar una nueva deuda al registro
};