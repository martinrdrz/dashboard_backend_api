const Sistema = require('../models/Sistema');

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
