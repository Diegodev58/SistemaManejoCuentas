

const Socket = io();




//escuchamos las deudas y pagos
Socket.on('comparacion', comparacion => {
    //console.log(comparacion);
    const tbodydeudas = document.getElementById('tbody-deudas');
    const { deudas, pagos, clientes } = comparacion;
    const datosdb = {
      deudas: deudas,
      pagos: pagos,
      clientes: clientes
    }
    //etiquetas de la ventana
    localStorage.setItem('datosdb', JSON.stringify(datosdb));
    
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
            const butoo = document.createElement('button');
            const tdbu = document.createElement('td')
            butoo.id = 'btn-eliminar'; // Asignar un ID al botón
            butoo.textContent = 'ver'; // Establecer el texto del botón
            butoo.classList.add('btn', 'btn-danger'); // Agregar clases al botón
            
            butoo.addEventListener('click', () => {

              datosCliente = {
                cliente: cliente,
                resumetota: resumen.totalDeuda,
                tatalpago: resumen.totalPago
              }
              //ventanaEmergente.classList.remove('oculto');
              localStorage.setItem('datosCliente', JSON.stringify(datosCliente)); // O sessionStorage.setItem(...)
              //verUsuario(cliente, resumen.totalDeuda, resumen.totalPago);
              window.location.href = '/private/ver.html';
            });
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${resumen.nombre}</td>
                <td>${resumen.totalDeuda.toFixed(2)} $</td>
                <td>${resumen.totalPago.toFixed(2)} $</td>
                <td>${(resumen.totalDeuda - resumen.totalPago).toFixed(2)} $</td>
               
            `;
            tdbu.appendChild(butoo)
            row.appendChild(tdbu)
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






//ventana ermegente 
const botonAbrir = document.getElementById('btn-eliminar');
const ventanaEmergente = document.getElementById('ventana-emergente');
const botonCerrar = document.querySelector('.cerrar-ventana');

// Agregar el evento click al botón para mostrar la ventana emergente
//botonAbrir

// Agregar el evento click al botón de cerrar para ocultar la ventana emergente
//botonCerrar.addEventListener('click', () => {
  //ventanaEmergente.classList.add('oculto');
  
