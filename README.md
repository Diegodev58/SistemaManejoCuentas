# Sistema_cuentas
# Documentación del Sistema de Gestión de Cuentas

## Descripción General
Aplicación web para gestión de cuentas por cobrar que permite:
- Registrar clientes
- Gestionar deudas y pagos
- Visualizar resúmenes financieros
- Realizar seguimiento en tiempo real

## Requisitos Técnicos

### Backend
- Node.js (v14+)
- Express
- Socket.IO
- JSON Web Tokens (JWT)
- Archiver (para generación de ZIP)

### Frontend
- HTML5, CSS3, JavaScript ES6+
- Bootstrap (opcional para estilos)
- Socket.IO Client

### Base de Datos
- Sistema de archivos JSON (sin necesidad de DB externa) (se recomienda usar una base de db)



## Funcionalidades Clave

### 1. Autenticación y Seguridad
- Login con JWT
- Cookies HTTP-only seguras
- Middleware de autenticación
- Protección de rutas privadas

```javascript
// Ejemplo de ruta protegida
app.get('/dashboard', Userautenticado, (req, res) => {
  res.sendFile(path.join(__dirname, 'private/dashboard.html'));
});





