    document.addEventListener('DOMContentLoaded', () => {
        const datosCliente = JSON.parse(localStorage.getItem('datosCliente')); // O sessionStorage.getItem(...)
        verUsuario(datosCliente.cliente, datosCliente.resumetota, datosCliente.tatalpago )
    })
   
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
      
      
     
     const datosdb = JSON.parse(localStorage.getItem('datosdb')); // O sessionStorage.getItem(...)
       
      const x = d - p;  


      vtotalp.innerHTML = 'Total Pagado: ' + p + '$'
      vtotald.innerHTML = 'Total Deuda: ' + x + '$'

      if(p > d){
        alert1.innerHTML = 'El monto del pago no puede ser mayor que la deuda pendiente. Por favor, verifica el monto ingresado y realiza el pago correcto. Si crees que hay un error en el sistema, no dudes en contactar al contador o al administrador web. '
      }else{
        alert1.innerHTML = '';
      }

      // Datos del cliente
      const cliente = datosdb.clientes.find((cliente) => cliente.nombre === idR);
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
      const deudasCliente = datosdb.deudas.filter((deuda) => deuda.nombre === idR);
      const pagosCliente = datosdb.pagos.filter((pago) => pago.nombre === idR);
    
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


function inicio(){
    window.location.href = '/private'
}