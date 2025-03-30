
const socket = io(); // Conectar al servidor Socket.IO

// eschuchams los usuarios registrados para el select
socket.on('clientes', (clientes) => {
    // Aquí puedes manejar los usuarios recibidos
    console.log('Usuarios recibidos:', clientes);
    
   // select.innerHTML = ''; // Limpiar el contenido actual del select
    for (const cliente of clientes) {
        const select = document.getElementById('usuario-deuda');
        const option = document.createElement('option');
        option.value = cliente.nombre; // Asignar el nombre como valor del option
        option.textContent = cliente.nombre;
        select.appendChild(option);
    }
    
});


socket.on('deudas', (deudas) => {
        // Aquí puedes manejar las deudas recibidas
        //console.log('Deudas recibidas:', deudas);
        for (const deuda of deudas) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${deuda.nombre}</td>
                <td>${deuda.Articulos}</td>
                <td>${deuda.Cantidad}</td>
                <td>${deuda.precio}</td>
                <td>${deuda.deuda}</td>
                <td>${deuda.fecha}</td>
            `;
            document.getElementById('tabla-deudas-pendientes').appendChild(row);
        }
    });