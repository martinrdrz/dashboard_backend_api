const { response } = require('express');
const serviceSistema = require('../services/sistemas');
const dto = require('../dto/dto');

const getSistemas = async (req, res = response) => {
    try {
        const result = await serviceSistema.getSistemas();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json(dto.error(error.message));
    }
};

const getSistema = async (req, res = response) => {
    const email = req.params.email;
    try {
        const result = await serviceSistema.getSistema(email);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json(dto.error(error.message));
    }
};

module.exports = {
    getSistemas,
    getSistema,
};
