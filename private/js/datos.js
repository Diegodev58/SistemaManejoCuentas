

const Socket = io();

//escuchamos las deudas y pagos
Socket.on('comparacion', comparacion => {
    console.log(comparacion);
    const tbodydeudas = document.getElementById('tbody-deudas');
    const { deudas, pagos, clientes } = comparacion;

    clientes.forEach(cliente => {
        deudas.forEach(deuda => {
            pagos.forEach(pago => {
                if (cliente.nombre === deuda.nombre && cliente.nombre === pago.nombre) {
                    // Creamos una fila para cada deuda y pago coincidente
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${cliente.nombre}</td>
                        <td>${deuda.deuda} $</td>
                        <td>${pago.pago} $</td>
                        <td>${Number(deuda.deuda) - Number(pago.pago)} $</td>
                    `;
                    tbodydeudas.appendChild(row);
                }
            });
        });
    });
});

// Ahora Comfiguramos en buscador de clientes   
const buscador = document.getElementById('buscador');
const tbodydeudas = document.getElementById('tbody-deudas');
// Agregamos un evento de entrada al buscador

buscador.addEventListener('input', () => {
    const busqueda = buscador.value.toLowerCase();
    const clientes = tbodydeudas.querySelectorAll('tr');

    clientes.forEach(cliente => {
        const nombre = cliente.querySelector('td').textContent.toLowerCase();
        if (nombre.includes(busqueda)) {
            cliente.style.display = '';
        } else {
            cliente.style.display = 'none';
        }
    }
    );
});

