
const clienteController = require('../controllers/clienteController'); // Controlador de clientes
const deudaController = require('../controllers/deudacontroller'); // Controlador de deudas
const pagoController = require('../controllers/pagoController'); // Controlador de pagos

function llamada(){
    deudaController.leerDeudas();
    pagoController.leerPagos();
}

const deudas = deudaController.leerDeudas();
const verPagos = pagoController.leerPagos();
const verclientes = clienteController.leerClientes();
let deudatotal = 0;
let pagototal = 0;
const datoinicial = 'Mensaje:'
const mensajeA = ['Mensaje: '] ;
let estadoOperacion = false
let enviarmsj;

function verificaexistencia(clientesExistentes, nuevoPago ){
    const clienteEncontrado = clientesExistentes.find((cliente) => cliente.nombre === nuevoPago.nombre)
    if(clienteEncontrado){
        validarpagomonto(nuevoPago.pago, nuevoPago.nombre, nuevoPago)
    }else{
        
        return mensajeA.push('Usuario invalido');
    }
}


function guardardeuda(nuevoPago){
    
    const pagoAgregado = pagoController.agregarPago(nuevoPago);
    return console.log(pagoAgregado)
    
        //return io.emit('nuevoPago', 'Operación exitosa'+ pagoAgregado); // Operación exitosa
    
}

function validartodo (nuevoPago){
    if (!nuevoPago.nombre || !nuevoPago.pago || !nuevoPago.referencia) {
        
        return mensajeA.push('Usuario invalido hay campos');
          //return io.emit('nuevoPago', 'Hay campos vacios'); // Validación fallida
          } else {
            const clientesExistentes = clienteController.leerClientes();
            verificaexistencia(clientesExistentes, nuevoPago)
        }
    //verificarDatos(clienteEncontrado)
}




async function calcularDeudaTotal(userPagador) {
    const userR = userPagador;
    const deudasv = deudas.filter((deuda) => deuda.nombre === userR);
    let deudatotal = 0; // Reiniciar deudatotal a 0
    console.log(deudasv);

    if (deudasv) {
        deudasv.forEach((deuda) => {
            deudatotal += Number(deuda.deuda);
        });
    }
    console.log('deuda  ' + deudatotal);
    return deudatotal; // Retornar el valor calculado
}

async function calcularPagostotal(userPagador) {
    const userR = userPagador;
    const pagosv = verPagos.filter((pago) => pago.nombre === userR);
    let pagototal = 0; // Reiniciar pagototal a 0
    console.log(pagosv);

    if (pagosv) {
        pagosv.forEach((pago) => {
            pagototal += Number(pago.pago);
        });
    }
    console.log('pagos:  ' + pagototal);
    return pagototal; // Retornar el valor calculado
}

async function validarpagomonto(pagouser, nombreuser, nuevoPago) {
    try {
        const deudaPendiente = await calcularDeudaPendiente(nombreuser);
        verificarMonto(pagouser, deudaPendiente);
    } catch (error) {
        console.error('Error en validarpagomonto:', error);
        mensajeA.push('Error al validar el pago');
    }

    async function calcularDeudaPendiente(nombreuser) {
        const deudaTotal = await calcularDeudaTotal(nombreuser);
        const pagoTotal = await calcularPagostotal(nombreuser);
        return deudaTotal - pagoTotal;
    }

    function verificarMonto(pagouser, deudaPendiente) {
        const pago = Number(pagouser);
        console.log('Deuda pendiente:', deudaPendiente, 'Pago:', pago);

        if (pago > deudaPendiente) {
            return mensajeA.push('El monto del pago no puede ser mayor que la deuda pendiente. Por favor, verifica el monto ingresado y realiza el pago correcto. Si crees que hay un error en el sistema, no dudes en contactar al contador o al administrador web.');
        } else {
            guardardeuda(nuevoPago);
           
            // Recalcular la deuda pendiente después de guardar el pago
            calcularDeudaPendiente(nombreuser).then(nuevaDeudaPendiente => {
                console.log('Nueva deuda pendiente:', nuevaDeudaPendiente);
                return mensajeA.push('todo bien');
            });
        }
    }
}
llamada()


module.exports={
    datoinicial,
    mensajeA,
    validarpagomonto,
    validartodo
}

