const axios = require('axios');
require('dotenv').config();

//En este caso se crea una instancia, y esta instancia es la que se utiliza para todas las peticiones axios a la API de backend
//console.log(process.env.THINGSPEAK_API_URL);
const thingspeakApi = axios.create({
    baseURL: process.env.THINGSPEAK_API_URL,
});

//Todo: configurar Interceptores
// thingspeak.interceptors.request.use((config) => {
//     config.headers = {
//         ...config.headers,
//         'x-token': localStorage.getItem('token'),
//     };
//     return config;
// });

module.exports = { thingspeakApi };
