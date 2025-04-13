
const clienteController = require('../controllers/clienteController'); // Controlador de clientes
const deudaController = require('../controllers/deudacontroller'); // Controlador de deudas
const pagoController = require('../controllers/pagoController'); // Controlador de pagos



const deudas = deudaController.leerDeudas();
const verPagos = pagoController.leerPagos();
const verclientes = clienteController.leerClientes();
let deudatotal = 0;
let mensajeA = '';
let estadoOperacion = false
let enviarmsj;

function verificaexistencia(clientesExistentes, nuevoPago ){
    const clienteEncontrado = clientesExistentes.find((cliente) => cliente.nombre === nuevoPago.nombre)
    if(clienteEncontrado){
        validarpagomonto(nuevoPago.pago, nuevoPago.nombre, nuevoPago)
    }else{
        return mensajeA = 'Usuario invalido'
    }
}


function guardardeuda(nuevoPago){
    const pagoAgregado = pagoController.agregarPago(nuevoPago);
    console.log(pagoAgregado)
        //return io.emit('nuevoPago', 'Operación exitosa'+ pagoAgregado); // Operación exitosa
    
}

function validartodo (nuevoPago){
    if (!nuevoPago.nombre || !nuevoPago.pago || !nuevoPago.referencia) {
        return mensajeA = 'Hay campos vacios'
          //return io.emit('nuevoPago', 'Hay campos vacios'); // Validación fallida
          } else {
            const clientesExistentes = clienteController.leerClientes();
            verificaexistencia(clientesExistentes, nuevoPago)
        }
    //verificarDatos(clienteEncontrado)
}





async function calcularDeudaTotal(userPagador){
    const userR = userPagador
    const deudasv = deudas.filter((deuda) => deuda.nombre === userR)
    console.log(deudasv)
    
    if(deudasv){
        deudasv.forEach((deuda) =>{
            deudatotal += Number(deuda.deuda);
        })
        //deudatotal += Number(deudas.deuda);
    }
    return console.log('desde aqui  '+ deudatotal);
}

//calcularDeudaTotal(diego)
async function validarpagomonto( pagouser , nombreuser , nuevoPago){
    await calcularDeudaTotal(nombreuser)
    Number(pagouser)
    if(pagouser > deudatotal){
        mensajeA = 'El monto del pago no puede ser mayor que la deuda pendiente. Por favor, verifica el monto ingresado y realiza el pago correcto. Si crees que hay un error en el sistema, no dudes en contactar al contador o al administrador web. '
        console.log(mensajeA)
        return  estadoOperacion = false;
    }else{
        mensajeA = 'todo bien'
       
        guardardeuda(nuevoPago)
        return estadoOperacion = true;
    }
   
   

}





module.exports={
    mensajeA,
    enviarmsj,
    estadoOperacion,
    validarpagomonto,
    validartodo
}