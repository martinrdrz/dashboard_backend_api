const Sistema = require('../models/Sistema');

//fomato datoAlerta
// {
//     "usuario": "martinrdrz@hotmailcom",
//     "sistema": "sistema_1",
//     "dato": "dato_1",
//     "estado": 1      (solo si se va a setear dicho valor, para operacion get no es necesario)
// }
const getAlert = async ({ usuario, sistema, dato }) => {
    try {
        verificarDatos({ usuario, sistema, dato, estado: 0 }); //sea agrega estado para que verificarDatos no de error por falta de ese campo.
        const filtro = { email: usuario };
        const proyeccion = { [`${sistema}.${dato}.estado_alerta`]: 1, _id: 0 };
        const result = await Sistema.findOne(filtro, proyeccion);
        if (!result) {
            throw new Error('No se encontró la propiedad espacificada.');
        }
        return {
            value: result[sistema][dato].estado_alerta,
        };
    } catch (error) {
        throw error;
    }
};

const setAlert = async ({ usuario, sistema, dato, estado }) => {
    try {
        verificarDatos({ usuario, sistema, dato, estado });
        const filtro = { email: usuario };
        const update = { $set: { [`${sistema}.${dato}.estado_alerta`]: estado } };
        const result = await Sistema.updateOne(filtro, update);

        if (result.matchedCount === 0) {
            throw new Error('No se encontró el sistema o dato especificado.');
        }

        return {
            updated: result.modifiedCount,
        };
    } catch (error) {
        throw error;
    }
};

const verificarDatos = (datoAlerta) => {
    if (!datoAlerta.usuario) {
        throw new Error('Falta campo usuario del mensaje.');
    }
    if (!datoAlerta.sistema) {
        throw new Error('Falta campo sistema del mensaje.');
    }
    if (!datoAlerta.dato) {
        throw new Error('Falta campo dato del mensaje.');
    }
    if (datoAlerta.estado == undefined || datoAlerta.estado == null) {
        throw new Error('Falta campo estado del mensaje.');
    }
    if (datoAlerta.estado !== 0 && datoAlerta.estado !== 1) {
        throw new Error('Falta campo estado del mensaje.');
    }

    return true;
};

module.exports = {
    getAlert,
    setAlert,
};
