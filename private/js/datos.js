

const Socket = io();

//escuchamos las deudas y pagos
Socket.on('comparacion', comparacion => {
    //console.log(comparacion);
    const tbodydeudas = document.getElementById('tbody-deudas');
    const { deudas, pagos, clientes } = comparacion;

    // Limpiar el tbody antes de agregar nuevos datos
    tbodydeudas.innerHTML = '';

    // Primero, procesamos los datos para agrupar por cliente
    const resumenClientes = {};

    // Procesar deudas
    deudas.forEach(deuda => {
        if (!resumenClientes[deuda.nombre]) {
            resumenClientes[deuda.nombre] = {
                nombre: deuda.nombre,
                totalDeuda: 0,
                totalPago: 0
            };
        }
        resumenClientes[deuda.nombre].totalDeuda += Number(deuda.deuda);


        
    });

    // Procesar pagos
    pagos.forEach(pago => {
        if (!resumenClientes[pago.nombre]) {
            resumenClientes[pago.nombre] = {
                nombre: pago.nombre,
                totalDeuda: 0,
                totalPago: 0
            };
        }
        resumenClientes[pago.nombre].totalPago += Number(pago.pago);
    });

    // Ahora generamos las filas para cada cliente
    clientes.forEach(cliente => {
        if (resumenClientes[cliente.nombre]) {
            const resumen = resumenClientes[cliente.nombre];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${resumen.nombre}</td>
                <td>${resumen.totalDeuda.toFixed(2)} $</td>
                <td>${resumen.totalPago.toFixed(2)} $</td>
                <td>${(resumen.totalDeuda - resumen.totalPago).toFixed(2)} $</td>
                <td><button class="btn btn-danger" id="btn-eliminar">Ver</button></td>
            `;
            tbodydeudas.appendChild(row);
        }
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
//total deuda
Socket.on('dartotal', dartotal => {
    const etiquetatotal = document.getElementById('total-por-cobrar');
    const deudas = dartotal.deuda;
    let deudatotal = 0;
    for (let deuda of deudas) {
      deudatotal += deuda;
    }
    console.log(deudatotal); // Muestra la suma en la consola (opcional)
    etiquetatotal.innerHTML = deudatotal+ '$'; // Muestra la suma en el elemento HTML
  });


Socket.on('pagost', pagost => {
    const etiquetatotal = document.getElementById('total-pagos');
    if (etiquetatotal) { // Verifica si el elemento existe
      const pagos = pagost.pago;
      let pagostotales = 0;
      if (Array.isArray(pagos)) { // Verifica si 'pagos' es un arreglo
        for (let pago of pagos) {
          if (typeof pago === 'number') { // Verifica si 'pago' es un número
            pagostotales += pago;
          } else {
            console.error('Valor de pago no válido:', pago);
          }
        }
        etiquetatotal.innerHTML = pagostotales + '$';
      } else {
        console.error('Pagos no es un arreglo válido:', pagos);
      }
    } else {
      console.error('Elemento con ID "total-pagos" no encontrado.');
    }
  });


Socket.on('totalclientes', totalclientes => {
    const i = totalclientes
    const totaluser = document.getElementById('total-usuarios');
    totaluser.innerHTML = i;
  });