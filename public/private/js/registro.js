const socket = io();


// Obtener el formulario de registro
const formularioRegistro = document.getElementById('formularioRegistro');

// Escuchar el evento 'registro' desde el servidor 
//mostramos los datos del cliente en la tabla
socket.on('registro', (clientes) => {
    
    const demo = document.getElementById('demo');
    demo.innerHTML = '';
    for(let datas of clientes){
        const tr = document.createElement('tr');
        const tdNombre = document.createElement('td');
        const tdTelefono = document.createElement('td');
        const tdReferencia = document.createElement('td');
        const tdFecha = document.createElement('td');
        const tdAcciones = document.createElement('td');

        tdNombre.textContent = datas.nombre;
        tdTelefono.textContent = datas.telefono;
        tdReferencia.textContent = datas.referencia;
        tdFecha.textContent = datas['Fecha de creacion'];
        tdAcciones.innerHTML = `
            <button class="btn btn-danger" data-id="${datas.nombre}">Eliminar</button>
        `;

        tr.appendChild(tdNombre);
        tr.appendChild(tdTelefono);
        tr.appendChild(tdReferencia);
        tr.appendChild(tdFecha);
        tr.appendChild(tdAcciones);

        demo.appendChild(tr);
    }
});