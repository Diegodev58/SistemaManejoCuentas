//const e = require("express");

const socket = io(); // Conectar al servidor Socket.IO

const formularioDeuda = document.querySelector('#form-deuda'); // Obtener el formulario de deuda




// eschuchams los usuarios registrados para el select
socket.on('clientes', (clientes) => {
    // Aquí puedes manejar los usuarios recibidos
    //console.log('Usuarios recibidos:', clientes);
    
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
                <td>${deuda.precio} $</td>
                <td>${deuda.deuda} $</td>
                <td>${deuda.fecha}</td>
            `;
            document.getElementById('tabla-deudas-pendientes').appendChild(row);
        }
    });

formularioDeuda.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    // Obtener los datos del formulario
    const usuario = document.querySelector('#usuario-deuda').value;
    const cantidad = document.querySelector('.cantidad').value;
    const monto = document.querySelector('.monto').value;
    const concepto = document.querySelector('#concepto').value;
    const total = cantidad * monto; // Calcular el total multiplicando cantidad por monto
    const fecha = new Date().toLocaleDateString(); // Obtener la fecha actual

    // Crear un objeto con los datos de la deuda
    const nuevaDeuda = {
        nombre: usuario,
        Articulos: concepto,
        Cantidad: cantidad,
        precio: monto ,
        deuda: total ,
        fecha: fecha
    };

    // Enviar la deuda al servidor
    socket.emit('nuevaDeuda', nuevaDeuda);

    // Limpiar el formulario
    formularioDeuda.reset();
       } 
);

socket.on('nuevaDeuda', (nuevaDeuda) => {
    if(nuevaDeuda){
        alert('Todo salio bien')
        return window.location.reload()
    }else{
        alert('Error Hiciste algo mal')
    }
});


const buscador = document.getElementById('buscador');
const tbodydeudas = document.getElementById('democ');

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
  )}  );