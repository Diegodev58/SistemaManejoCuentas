

const Socket = io();




//escuchamos las deudas y pagos
Socket.on('comparacion', comparacion => {
    //console.log(comparacion);
    const tbodydeudas = document.getElementById('tbody-deudas');
    const { deudas, pagos, clientes } = comparacion;
    
    //etiquetas de la ventana
    const vcorreo = document.querySelector('#vcorreo')
    const vtelefono = document.querySelector('#vtelefono')
    const vnombre = document.querySelector('#vnombre')
    const vtabla = document.querySelector('#vdeuda')
    const vpago = document.querySelector('#vpago')
    const vtotalp = document.querySelector('#vtotalp')
    const vtotald = document.querySelector('#vtotald')
    const alert1 = document.querySelector('#alert1')
    function verUsuario(c, d, p) {
      const idR = c.nombre;
      console.log('ver ' + idR);
      
      
      vtotalp.innerHTML = 'Total Pagado: ' + p + '$'
      vtotald.innerHTML = 'Total Deuda: ' + d + '$'

      if(p > d){
        alert1.innerHTML = 'El monto del pago no puede ser mayor que la deuda pendiente. Por favor, verifica el monto ingresado y realiza el pago correcto. Si crees que hay un error en el sistema, no dudes en contactar al contador o al administrador web. '
      }else{
        alert1.innerHTML = '';
      }

      // Datos del cliente
      const cliente = clientes.find((cliente) => cliente.nombre === idR);
      vnombre.innerHTML = 'Detalles del Usuario: ' + idR;
    
      if (!cliente) {
        vcorreo.innerHTML = "Cliente no encontrado";
        vtelefono.innerHTML = "";
        return;
      }
    
      vcorreo.innerHTML = cliente.email || "No tiene correo registrado";
      vtelefono.innerHTML = cliente.telefono || "No tiene teléfono registrado";
    
      console.log(cliente.email || "No tiene correo registrado");
      console.log(cliente.telefono || "No tiene teléfono registrado");
    
      // Deudas del cliente
      const deudasCliente = deudas.filter((deuda) => deuda.nombre === idR);
      const pagosCliente = pagos.filter((pago) => pago.nombre === idR);
    
      // Limpiar la tabla antes de agregar nuevas filas
      vtabla.innerHTML = "";
    
      if (deudasCliente.length > 0) {
        deudasCliente.forEach((deuda) => {
          const fila = document.createElement('tr');
          const td1 = document.createElement('td'); // Artículos
          const td2 = document.createElement('td'); // Precio
          const td3 = document.createElement('td'); // Cantidad
          const td4 = document.createElement('td'); // Fecha de Compra
          const td5 = document.createElement('td'); // Fecha de Pago
          const td6 = document.createElement('td'); // Referencia
          const td7 = document.createElement('td'); // Deuda
    
          td1.textContent = deuda.Articulos;
          td2.textContent = deuda.precio + '$';
          td3.textContent = deuda.Cantidad;
          td4.textContent = deuda.fecha; // Asegúrate de que el nombre de la propiedad sea correcto
         
          td7.textContent = deuda.deuda + '$';
    
          fila.appendChild(td1);
          fila.appendChild(td2);
          fila.appendChild(td3);
          fila.appendChild(td4);
          fila.appendChild(td5);
          fila.appendChild(td6);
          fila.appendChild(td7);
    
          vtabla.appendChild(fila);
        });
      } else {
        vtabla.innerHTML = "<tr><td colspan='7'>No tiene deudas registradas</td></tr>";
      }
      if (pagosCliente.length > 0) {
        pagosCliente.forEach((pago) => {
          const fila = document.createElement('tr');
          const td1 = document.createElement('td'); // Artículos
          const td2 = document.createElement('td'); // Precio
          const td3 = document.createElement('td'); // Cantidad
          const td4 = document.createElement('td'); // Fecha de Compra
          const td5 = document.createElement('td'); // Fecha de Pago
          const td6 = document.createElement('td'); // Referencia
          const td7 = document.createElement('td'); // Deuda
          const td8 = document.createElement('td'); // pago
          td6.textContent = pago.referencia;
          td5.textContent = pago.fecha;
          td8.textContent = pago.pago + '$';
         // Asegúrate de que el nombre de la propiedad sea correcto
         
          //td7.textContent = pago.deuda + '$';
    
          fila.appendChild(td1);
          fila.appendChild(td2);
          fila.appendChild(td3);
          fila.appendChild(td4);
          fila.appendChild(td5);
          fila.appendChild(td6);
          fila.appendChild(td7);
          fila.appendChild(td8);
          vtabla.appendChild(fila);
        });
      } else {
        vtabla.innerHTML = "<tr><td colspan='7'>No tiene deudas registradas</td></tr>";
      }

    
      // Historial de pagos
      
    }
    
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
              ventanaEmergente.classList.remove('oculto');
              verUsuario(cliente, resumen.totalDeuda, resumen.totalPago);

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
botonCerrar.addEventListener('click', () => {
  ventanaEmergente.classList.add('oculto');
});