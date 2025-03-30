const fs = require('fs');
const path = require('path');


const clientesPath = path.join(__dirname, '..', 'data', 'clientes.json');

const leerClientes = () => {
    try {
        const data = fs.readFileSync(clientesPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error leyendo el archivo de clientes:', err);
        return [];
    }
};

const guardarClientes = (clientes) => {
    try {
        fs.writeFileSync(clientesPath, JSON.stringify(clientes, null, 2));
    } catch (err) {
        console.error('Error guardando el archivo de clientes:', err);
    }
};


//agregar cliente
const agregarClientes = (nuevoCliente) => {
    const clientes = leerClientes();
    clientes.push(nuevoCliente);
    guardarClientes(clientes);
    return nuevoCliente;
};

//eliminar cliente
const eliminarCliente = (nombre) => {
    const clientes = leerClientes();
    const cliente = clientes.find((cliente) => cliente.nombre === nombre);
    if (cliente) {
        const nuevosClientes = clientes.filter((cliente) => cliente.nombre !== nombre);
        guardarClientes(nuevosClientes);
        return cliente;
    }
    return null;
};


module.exports = {
    leerClientes,
    guardarClientes,
    agregarClientes,
    eliminarCliente,
};