const fs = require('fs');
const path = require('path');

const deudasPath = path.join(__dirname, '..', 'data', 'deudas.json');

const leerDeudas = () => {
    try {
        const data = fs.readFileSync(deudasPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error leyendo el archivo de deudas:', err);
        return [];
    }
}
const guardarDeudas = (deudas) => {
    try {
        fs.writeFileSync(deudasPath, JSON.stringify(deudas, null, 2));
    } catch (err) {
        console.error('Error guardando el archivo de deudas:', err);
    }
}
/// Función para agregar una nueva deuda
const agregarDeuda = (deuda) => {
    const deudas = leerDeudas();
    deudas.push(deuda);
    guardarDeudas(deudas);
}



module.exports = {
    leerDeudas,
    guardarDeudas,
    agregarDeuda,
};
