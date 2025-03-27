// Importar el módulo 'fs' para manejar archivos
const fs = require('fs');
const path = require('path');

// Definir la ruta del archivo JSON de usuarios
// (El archivo se encuentra en: data/usuarios.json)
const usuariosPath = path.join(__dirname, '..', 'data', 'usuarios.json');

// Función para leer los usuarios desde el archivo JSON
const leerUsuarios = () => {
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

// Función para guardar los usuarios en el archivo JSON
const guardarUsuarios = (usuarios) => {
    try {
        // Convertir el array de usuarios a formato JSON y guardarlo en el archivo
        fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
    } catch (err) {
        console.error('Error guardando el archivo de usuarios:', err);
    }
};

// Función para agregar un nuevo usuario
const agregarUsuario = (nuevoUsuario) => {
    // Obtener la lista actual de usuarios usando la función 'leerUsuarios'
    const usuarios = leerUsuarios();

    // Agregar el nuevo usuario al array
    usuarios.push(nuevoUsuario);

    // Guardar el array actualizado en el archivo JSON usando la función 'guardarUsuarios'
    guardarUsuarios(usuarios);

    // Retornar el usuario agregado (esto se usa en server.js para emitir el nuevo usuario)
    return nuevoUsuario;
};

// Exportar las funciones para usarlas en otros archivos
// (Estas funciones se usan en: server.js)
module.exports = {
    leerUsuarios,
    agregarUsuario,
};