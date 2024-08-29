const Sistema = require('../models/Sistema');
const { thingspeakApi } = require('../api/thingspeak');

const getSistemas = async () => {
    try {
        const usersSystemsData = await Sistema.find({});
        if (!usersSystemsData) {
            throw new Error('No hay datos de sistemas');
        }
        return usersSystemsData;
    } catch (error) {
        throw error;
    }
};

const getSistema = async (email = null) => {
    try {
        const userSystemsData = await Sistema.findOne({ email });
        if (!userSystemsData) {
            throw new Error('No existe un sistema para ese email');
        }
        return userSystemsData;
    } catch (error) {
        throw error;
    }
};

const getData = async (email) => {
    try {
        const userSystemsData = await Sistema.findOne({ email });
        if (!userSystemsData) {
            throw new Error('No existe un sistema para ese email');
        }

        //devuelve un array con cada una de las url para pedir los datos a thingspeak
        const arrayUrlQueries = getUrlQueries(userSystemsData);
        console.log(arrayUrlQueries);

        //Realiza una llamada en paralelo a todas las url para traer los datos de todos los canales desde thingspeak.
        //Devuelve una lista, donde cada componente es una lista que tiene cada uno de los datos del canal en cuestion, es decir, cada componente de esta ultima lista es un objeto con todos los campos y valores para el canal en cuestion. y la ultima es una lista porque tiene todos los valores historicos almacenados para ese canal, el ultimo valor de la lista es el valor mas reciente.
        const arrayDataFromThingspeak = await getDataFromThingspeak(arrayUrlQueries);
        console.log(arrayDataFromThingspeak);

        const arraySortedData = getDataFromQuery(arrayDataFromThingspeak);

        const userSystemDataWithValue = getUserSystemsWithValues(userSystemsData, arraySortedData);
        return userSystemDataWithValue;
    } catch (error) {
        console.log('Error');
        throw error;
    }
};

const apiCall = async (arrayUrlQueries) => {
    const apiCalls = arrayUrlQueries.map((url) => thingspeakApi.get(url));
    try {
        const results = await Promise.all(apiCalls);
        results.forEach((result) => {
            if (!result.data) {
                throw new Error('No existen datos en Thingspeak para alguna de las consultas.');
            }
        });
        return results.map((result) => result.data);
    } catch (error) {
        throw error;
    }
};

//Arma una lista (array) con los string de las consultas a Thingspeak para obtener los datos. Cada consulta trae los datos de un canal entrero, el mismo puede estar completo o parcialmente completo.
const getUrlQueries = (userSystemsData) => {
    const arrayUrlQueries = [];
    const thingspeakAmountResults = process.env.THINGSPEAK_RESULTS;

    console.log(`---------------${thingspeakAmountResults}`);

    for (let i = 1; i <= userSystemsData.cant_sistemas; i++) {
        const systemKey = `sistema_${i}`;
        const system = userSystemsData[systemKey];
        if (!system) {
            throw new Error('Uno de los sistemas no posee datos para leer.');
        }

        for (let j = 1; j <= userSystemsData[systemKey].cant_canales_asignados; j++) {
            const channelKey = `canal_${j}`;
            const channelValue = userSystemsData[systemKey][channelKey];
            if (!channelValue) {
                throw new Error('No existe el canal canal_${j} del sistema sistema_${i}.');
            }
            const readApiKey = `readAPIkey_${j}`;
            const apiKeyValue = userSystemsData[systemKey][readApiKey];
            if (!apiKeyValue) {
                throw new Error('No existe el apiKey readAPIkey_${j} del sistema sistema_${i}.');
            }
            const queryUrl = `/channels/${channelValue}/feeds.json?api_key=${apiKeyValue}&results=${thingspeakAmountResults}`;
            arrayUrlQueries.push(queryUrl);
        }
    }
    return arrayUrlQueries;
};

const getDataFromThingspeak = async (arrayUrlQueries) => {
    const apiCalls = arrayUrlQueries.map((url) => thingspeakApi.get(url));
    try {
        const results = await Promise.all(apiCalls);
        results.forEach((result) => {
            if (!result.data) {
                throw new Error('No existen datos en Thingspeak para alguna de las consultas.');
            }
        });
        return results.map((result) => result.data.feeds);
    } catch (error) {
        throw error;
    }
};

const getDataFromQuery = (arrayUrlQueries) => {
    //todo
    return true;
};

const getUserSystemsWithValues = (arrayUrlQueries, arrayData) => {
    //todo
    return true;
};

const getData_OK = async (email) => {
    try {
        const userSystemsData = await Sistema.findOne({ email });
        if (!userSystemsData) {
            throw new Error('No existe un sistema para ese email');
        }
        //todo
        let systemsData = {};

        //En systemsData se almacena en formato json cada uno de los valores de los datos de cada sistema para el usuario dado
        for (let i = 1; i <= userSystemsData.cant_sistemas; i++) {
            const systemKey = `sistema_${i}`;
            const system = userSystemsData[systemKey];
            if (!system) {
                throw new Error('Uno de los sistemas no posee datos para leer.');
            }
            systemsData[systemKey] = {};

            for (let j = 1; j <= userSystemsData[systemKey].cant_datos; j++) {
                const dataKey = `dato_${j}`;
                const dataValue = userSystemsData[systemKey][dataKey];
                if (!dataValue) {
                    throw new Error('No existe el dato data_${j} del sistema sistema_${i}.');
                }
                systemsData[systemKey][dataKey] = dataValue;
            }
        }
        console.log(systemsData);
        return systemsData;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getSistemas,
    getSistema,
    getData,
};
