
const socket = io();

socket.on('deudas', (deudas) => {
        // Aquí puedes manejar las deudas recibidas
        console.log('Deudas recibidas:', deudas);
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