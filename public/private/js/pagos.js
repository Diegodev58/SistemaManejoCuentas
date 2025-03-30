

const Socket = io()

const demo = document.getElementById('demo')
const formulariopago = document.querySelector('#form-pago')


Socket.on('pagos', (pagos) => {
    demo.innerHTML = '';
    for(let datas of pagos){
        const tr = document.createElement('tr');
        const tdUsuario = document.createElement('td');
        const tdMonto = document.createElement('td');
        const tdFecha = document.createElement('td');
        const tdReferencia = document.createElement('td');
        const tdDescripcion = document.createElement('td');

        tdUsuario.textContent = datas.nombre;
        tdMonto.textContent = datas.pago;
        tdFecha.textContent = datas.fecha;
        tdReferencia.textContent = datas.referencia;
        tdDescripcion.textContent = datas.descripcion;

        tr.appendChild(tdUsuario);
        tr.appendChild(tdMonto);
        tr.appendChild(tdFecha);
        tr.appendChild(tdReferencia);
        tr.appendChild(tdDescripcion);

        demo.appendChild(tr);
    }
})
       
Socket.on('clientes', (clientes) => {
    // Aquí puedes manejar los usuarios recibidos
    console.log('Usuarios recibidos:', clientes);
    
   // select.innerHTML = ''; // Limpiar el contenido actual del select
    for (const cliente of clientes) {
        const select = document.querySelector('#usuario'); // Asegúrate de que este selector sea correcto
        const option = document.createElement('option');
        option.value = cliente.nombre; // Asignar el nombre como valor del option
        option.textContent = cliente.nombre;
        select.appendChild(option);
    }
    
});


// enviar el pago al servidor

formulariopago.addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = document.querySelector('#usuario').value;
    const monto = document.querySelector('#monto').value;
    const referencia = document.querySelector('#referencia').value;
    const descripcion = document.querySelector('#descripcion').value;
    if( referencia.length !== 4){
        alert('La referencia debe tener 4 digitos')
        return
    }
    const nuevoPago = {
        nombre: usuario,
        pago: Number(monto) + '$',
        fecha: new Date().toLocaleDateString(),
        referencia: referencia,
        descripcion: descripcion
    }
    console.log(nuevoPago);
    Socket.emit('nuevoPago', nuevoPago);
    formulariopago.reset();
    // Aquí puedes manejar la respuesta del servidor si es necesario
    Socket.on('nuevoPago', (estado) => {
        if(estado){
            console.log('Pago agregado');
            alert('Pago agregado');
            window.location.reload()
        }else{
            console.log('Error al agregar el pago');
            alert('Error al agregar el pago');
        }
    })
})