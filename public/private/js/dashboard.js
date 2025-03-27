// dashboard.js - Lógica para el panel general

/**
 * Este archivo contiene la lógica para el panel general (dashboard)
 * Muestra resúmenes y la tabla de deudas por usuario
 */

// Importar funciones y variables necesarias
import {
  calcularTotales,
  formatearMoneda,
  obtenerUsuarios,
  calcularDeudaUsuario,
  obtenerUltimoPagoUsuario,
  formatearFecha,
} from "./funciones.js"

// Función para cargar los datos del dashboard
function cargarDashboard() {
  // Obtener totales
  const totales = calcularTotales()

  // Actualizar tarjetas de resumen
  document.getElementById("total-usuarios").textContent = totales.totalUsuarios
  document.getElementById("total-por-cobrar").textContent = formatearMoneda(totales.totalPorCobrar)
  document.getElementById("total-pagos").textContent = formatearMoneda(totales.totalPagos)

  // Cargar tabla de deudas por usuario
  cargarTablaDeudas()
}

// Función para cargar la tabla de deudas por usuario
function cargarTablaDeudas() {
  const tablaBody = document.querySelector("#tabla-deudas tbody")
  tablaBody.innerHTML = ""

  const listaUsuarios = obtenerUsuarios()

  if (listaUsuarios.length === 0) {
    tablaBody.innerHTML = '<tr><td colspan="4" class="text-center">No hay usuarios registrados</td></tr>'
    return
  }

  // Para cada usuario, mostrar su deuda total usando un bucle for
  for (let i = 0; i < listaUsuarios.length; i++) {
    const usuario = listaUsuarios[i]
    const deudaTotal = calcularDeudaUsuario(usuario.id)
    const ultimoPago = obtenerUltimoPagoUsuario(usuario.id)

    const tr = document.createElement("tr")

    // Determinar el estado según la deuda
    let estado = "Al día"
    if (deudaTotal > 0) {
      estado = "Con deuda"
    }

    tr.innerHTML = `
            <td>${usuario.nombre}</td>
            <td>${formatearMoneda(deudaTotal)}</td>
            <td>${ultimoPago ? formatearFecha(ultimoPago.fecha) : "Sin pagos"}</td>
            <td>${estado}</td>
        `

    tablaBody.appendChild(tr)
  }
}

// Cargar dashboard al iniciar
document.addEventListener("DOMContentLoaded", cargarDashboard)

