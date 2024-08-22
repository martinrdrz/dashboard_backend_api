const { response } = require('express');
const serviceSistema = require('../services/sistema');
const dto = require('../dto/dto');

const getSistemas = async (req, res = response) => {
    try {
        console.log('Dentro del controlador');
        const result = await serviceSistema.getSistemas();
        return res.status(200).json(dto.ok(result));
    } catch (error) {
        return res.status(400).json(dto.error({ message: error.message }));
    }
};

const getSistema = async (req, res = response) => {
    const { email } = req.body;
    try {
        const result = await serviceSistema.getSistema(email);
        return res.status(200).json(dto.ok(result));
    } catch (error) {
        return res.status(400).json(dto.error({ message: error.message }));
    }
};

module.exports = {
    getSistemas,
    getSistema,
};
