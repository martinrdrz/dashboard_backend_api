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
        const urlQueryList = getUrlQueries(userSystemsData, resultCount);
        console.log(urlQueryList);

        // Realiza una llamada en paralelo a todas las url para traer los datos de todos los canales desde thingspeak.
        // Devuelve una lista, donde cada componente es una lista que tiene cada uno de los datos del canal en cuestion, es decir, cada componente de esta ultima lista es un objeto con todos los campos y valores para el canal en cuestion. y la ultima es una lista porque tiene todos los valores historicos almacenados para ese canal, el ultimo valor de la lista es el valor mas reciente.
        const valuesListFromThingspeak = await getDataFromThingspeak(urlQueryList);

        //Devuelve un objeto con propiedades del tipo mencionado abajo que copntiene los valores para todos los datos almacenados para el usuario en particular. Los datos son nombrados de manera creciente del 1 hasta terminar con todos los datos de todos los canales de todos los sistemas que hayan sido asignados a ese usuario enparticular.
        //  { data_1: [ '21', '26', '50' ],
        //   data_2: [ '-16', '-15', '60' ],
        //   data_3: [ '-30', '-56', '70' ],
        //   data_4: [ '6', '-4', '80' ],
        //   data_5: [ '-11', '-11', '-22' ],
        //   data_6: [ '0', '0', '4' ] }
        const allFieldsSortedValues = getDataSortedFromThingspeakData(valuesListFromThingspeak);
        console.log(allFieldsSortedValues);
        const userSystemDataWithValues = getUserSystemsWithValues(userSystemsData, allFieldsSortedValues);
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

const getDataFromThingspeak = async (urlQueryList) => {
    const apiCalls = urlQueryList.map((url) => thingspeakApi.get(url));
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

//Formato: arrayValuesFromThingspeak
// [
//     [
//        {created_at: '2024-08-26T13:08:44Z', entry_id: 644, field1: '26', field2: '-15', field3: '-56', field4: '-4'},
//        {created_at: '2024-08-29T16:05:09Z', entry_id: 645, field1: '50', field2: '60', field3: '70', field4: '80'},
//     ],
//     [
//        {created_at: '2024-05-20T20:31:27Z', entry_id: 637, field1: '-11', field2: '0'},
//        {created_at: '2024-08-26T13:08:44Z', entry_id: 638, field1: '-22', field2: '4'},
//     ],
// ];
const getFieldsCount = (channelData) => {
    if (!channelData) {
        throw new Error('Canal de Thingspeak sin campos.');
    }
    const fieldCount = Object.keys(channelData).filter((key) => key.includes('field')).length;
    return fieldCount;
};

const getFieldHistoricalValues = (channelHistoricalValuesList, fieldIndex) => {
    //todo
    if (!channelHistoricalValuesList) {
        throw new Error('No existe lista de valores de Thingspeak ');
    }
    const fieldValuesList = channelHistoricalValuesList.map((element) => {
        return element[`field${fieldIndex}`];
    });
    return fieldValuesList;
};

const getDataSortedFromThingspeakData = (valuesListFromThingspeak) => {
    //todo
    const allFieldsSortedValues = {};
    var gralIndex = 0;
    valuesListFromThingspeak.forEach((channelHistoricalValuesList) => {
        if (!channelHistoricalValuesList) {
            throw new Error('Canal de Thingspeak sin campos.');
        }
        //obtengo la cantidad de propiedades "fields" de cada elemento, en realidad, para hacer eso, solo basta ver cuantas propiedadeds "field" existen en solo una de las componentes del elemento ya que todas son iguales en cantidad de propiedades "field".
        const fieldsCount = getFieldsCount(channelHistoricalValuesList[0]);
        for (let fieldIndex = 1; fieldIndex <= fieldsCount; fieldIndex++) {
            //todo
            const fieldHistoricalValues = getFieldHistoricalValues(channelHistoricalValuesList, fieldIndex);
            //console.log(fieldHistoricalValues);
            gralIndex += 1;
            allFieldsSortedValues[`data_${gralIndex}`] = fieldHistoricalValues;
        }
    });
    return allFieldsSortedValues;
};

const getUserSystemsWithValues = (userSystemsData, allFieldsSortedValues) => {
    var systemsFiledsValues = {};
    userSystemsData.forEach((system) => {
        //todo
        system.cant_datos;
        for (let dataInSystemIndex = 1; dataInSystemIndex <= system.cant_datos; dataInSystemIndex++) {
            //todo
        }
    });

    return true;
};

module.exports = {
    getSistemas,
    getSistema,
    getData,
};
