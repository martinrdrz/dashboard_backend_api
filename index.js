const path = require('path');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use(cors());

// Directorio Público
//app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sistemas', require('./routes/sistemas'));
app.use('/api/events', require('./routes/events'));

//Este caso es apra cuando ponemos el frontend en la carpeta public del backend y queremos acceder a alguna ruta de manera directa, como cuando teniamos el frontend separado, por ejmplo "host/auth/login" y dicha ruta va a ser interceptada por el express y no la tiene definida, por tal motivo la va a atrapar este nueva linea y le da curso correcto.
//app.use('*', (req, res) => {
//    res.sendFile(path.join(__dirname, 'public/index.html'));
//});

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
