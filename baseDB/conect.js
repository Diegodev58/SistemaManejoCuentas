// Importa la librería mongoose, que es una herramienta de modelado de objetos (ODM) para MongoDB.
// Mongoose facilita la interacción con la base de datos MongoDB desde Node.js.
const mongoose = require('mongoose');

// Define una función asíncrona llamada `dbConnection` que se encargará de establecer la conexión con la base de datos.
const dbConnection = async() => {

    try {
        // Intenta conectarse a la base de datos utilizando la URL de conexión almacenada en la variable de entorno `MONGODBCONNECTION`.
        // `process.env.MONGODBCONNECTION` es una variable de entorno que contiene la cadena de conexión a la base de datos MongoDB.
        // `await` se utiliza para esperar a que la conexión se establezca antes de continuar con la ejecución del código.
        await mongoose.connect( process.env.MONGODBCONNECTION)
            // Si la conexión es exitosa, se ejecuta el callback `.then()` que imprime un mensaje en la consola indicando que la base de datos está en línea.
            .then( () => console.log('Base de datos online') );

        
    } catch (error) {
        // Si ocurre un error durante la conexión, se captura en el bloque `catch`.
        // Se imprime el error en la consola para facilitar la depuración.
        console.log(error);
        // Se lanza un nuevo error con un mensaje descriptivo para indicar que hubo un problema al iniciar la base de datos.
        throw new Error('Error a la hora de iniciar la base de datos');
    }

}

// Exporta la función `dbConnection` para que pueda ser utilizada en otros módulos de la aplicación.
// Esto permite que la conexión a la base de datos se maneje de manera modular y reutilizable.
module.exports = {
    dbConnection
}