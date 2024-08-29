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

const getData = async (email, resultCount) => {
    try {
        const userSystemsData = await Sistema.findOne({ email });
        if (!userSystemsData) {
            throw new Error('No existe un sistema para ese email');
        }

        //devuelve un array con cada una de las url para pedir los datos a thingspeak
        const arrayUrlQueries = getUrlQueries(userSystemsData, resultCount);
        console.log(arrayUrlQueries);

        // Realiza una llamada en paralelo a todas las url para traer los datos de todos los canales desde thingspeak.
        // Devuelve una lista, donde cada componente es una lista que tiene cada uno de los datos del canal en cuestion, es decir, cada componente de esta ultima lista es un objeto con todos los campos y valores para el canal en cuestion. y la ultima es una lista porque tiene todos los valores historicos almacenados para ese canal, el ultimo valor de la lista es el valor mas reciente.
        const arrayValuesFromThingspeak = await getDataFromThingspeak(arrayUrlQueries);
        //console.log(arrayValuesFromThingspeak);

        const arraySortedValues = getDataSortedFromThingspeakData(arrayValuesFromThingspeak);

        const userSystemDataWithValues = getUserSystemsWithValues(userSystemsData, arraySortedValues);
        return userSystemDataWithValues;
    } catch (error) {
        console.log('Error');
        throw error;
    }
};

//Arma una lista (array) con los string de las consultas a Thingspeak para obtener los datos. Cada consulta trae los datos de un canal entrero, el mismo puede estar completo o parcialmente completo.
const getUrlQueries = (userSystemsData, resultCount) => {
    const arrayUrlQueries = [];

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
            const queryUrl = `/channels/${channelValue}/feeds.json?api_key=${apiKeyValue}&results=${resultCount}`;
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

// [
//     [
//         {
//             created_at: '2024-08-26T13:08:44Z',
//             entry_id: 644,
//             field1: '26',
//             field2: '-15',
//             field3: '-56',
//             field4: '-4',
//         },
//         {
//             created_at: '2024-08-29T16:05:09Z',
//             entry_id: 645,
//             field1: '50',
//             field2: '60',
//             field3: '70',
//             field4: '80',
//         },
//     ],
//     [
//         {
//             created_at: '2024-05-20T20:31:27Z',
//             entry_id: 637,
//             field1: '-11',
//             field2: '0',
//         },
//         {
//             created_at: '2024-08-26T13:08:44Z',
//             entry_id: 638,
//             field1: '-22',
//             field2: '4',
//         },
//     ],
// ];

const getFieldsCount = (channelData) => {
    if (!channelData) {
        throw new Error('Canal de Thingspeak sin campos.');
    }
    const fieldCount = Object.keys(channelData).filter((key) => key.includes('field')).length;
    return fieldCount;
};

const getFieldHistoricalValues = (element, field) => {
    //todo
};

const getDataSortedFromThingspeakData = (arrayValuesFromThingspeak) => {
    //todo
    arrayValuesFromThingspeak.forEach((element) => {
        if (!element) {
            throw new Error('Canal de Thingspeak sin campos.');
        }
        //obtengo la cantidad de campos "fields" de cada elemento, en realidad solo basta con una de las compoenentes del elemento ya que todasson iguales en longitud
        const fieldsCount = getFieldsCount(element[0]);
        for (let field = 1; field <= fieldsCount; field++) {
            //todo
            const fieldHistoricalValues = getFieldHistoricalValues(element, field);
        }
    });

    return true;
};

const getUserSystemsWithValues = (userSystemsData, arraySortedValues) => {
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
