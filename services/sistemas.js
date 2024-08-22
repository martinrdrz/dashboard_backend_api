const Sistema = require('../models/Sistema');

const getSistemas = async () => {
    try {
        const result = await Sistema.find({});
        if (!result) {
            throw new Error('No hay datos de sistemas');
        }
        return result;
    } catch (error) {
        throw error;
    }
};

const getSistema = async (email = null) => {
    try {
        const result = await Sistema.findOne({ email });
        if (!result) {
            throw new Error('No existe un sistema para ese email');
        }
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getSistemas,
    getSistema,
};
