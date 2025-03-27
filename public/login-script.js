//const e = require("express");

const socket = io();
 // Inicializa el cliente Socket.IO

document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del DOM
  const loginForm = document.getElementById("login-form")
  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")
  const emailError = document.getElementById("email-error")
  const passwordError = document.getElementById("password-error")
  const togglePassword = document.getElementById("toggle-password")
  const eyeIcon = document.querySelector(".eye-icon")
  const eyeOffIcon = document.querySelector(".eye-off-icon")

  // Función para validar email
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  // Función para mostrar/ocultar contraseña
  togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text"
      eyeIcon.classList.add("hidden")
      eyeOffIcon.classList.remove("hidden")
    } else {
      passwordInput.type = "password"
      eyeIcon.classList.remove("hidden")
      eyeOffIcon.classList.add("hidden")
    }
  })

  // Validación en tiempo real para el email
  emailInput.addEventListener("input", () => {
    if (emailInput.value.trim() === "") {
      emailError.textContent = ""
    } else if (!validateEmail(emailInput.value)) {
      emailError.textContent = "Por favor, ingresa un correo electrónico válido"
    } else {
      emailError.textContent = ""
    }
  })

  // Validación en tiempo real para la contraseña
  passwordInput.addEventListener("input", () => {
    if (passwordInput.value.trim() === "") {
      passwordError.textContent = ""
    } else if (passwordInput.value.length < 6) {
      passwordError.textContent = "La contraseña debe tener al menos 6 caracteres"
    } else {
      passwordError.textContent = ""
    }
  })

  // Manejo del envío del formulario
  loginForm.addEventListener("submit", (e) => {
    let isValid = true

    // Validar email
    if (emailInput.value.trim() === "") {
      emailError.textContent = "El correo electrónico es requerido"
      isValid = false
    } else if (!validateEmail(emailInput.value)) {
      emailError.textContent = "Por favor, ingresa un correo electrónico válido"
      isValid = false
    } else {
      emailError.textContent = ""
    }

    // Validar contraseña
    if (passwordInput.value.trim() === "") {
      passwordError.textContent = "La contraseña es requerida"
      isValid = false
    } else if (passwordInput.value.length < 6) {
      passwordError.textContent = "La contraseña debe tener al menos 6 caracteres"
      isValid = false
    } else {
      passwordError.textContent = ""
    }

    // Si hay errores, prevenir el envío del formulario
    if (!isValid) {
      e.preventDefault()
    } else {
      e.preventDefault() // Prevenir envío para esta demo

      // Simulación de inicio de sesión exitoso
      

    
  }
  })

  // Efectos visuales para los campos de entrada
  const inputs = document.querySelectorAll("input")
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "scale(1.01)"
      this.parentElement.style.transition = "transform 0.2s ease"
    })

    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "scale(1)"
    })
  })

  // Animación para los botones sociales
  const socialButtons = document.querySelectorAll(".social-button")
  socialButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)"
    })

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })
})

// Escuchar el evento 'usuarios' desde el servidor
// (El servidor emite este evento en: server.js)

  // Mostrar la lista de usuarios en la consola del navegador
const emailindex = document.getElementById("email")
const passwordindex = document.getElementById("password")
const enviar = document.querySelector('#login-form');
  // desestructuro el objeto usuarios
 
 
   
enviar.addEventListener('submit', () => {
    socket.emit('enviarComprobar', { email: emailindex.value, password: passwordindex.value });
    socket.on('enviarComprobar', (enviarComprobar) => {
        console.log(enviarComprobar);
    
  
    });
  });
