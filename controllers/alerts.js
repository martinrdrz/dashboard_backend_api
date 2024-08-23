const { response } = require('express');
const serviceAlert = require('../services/alerts');
const dto = require('../dto/dto');

const getAlert = async (req, res = response) => {
    const datoAlert = req.body;
    try {
        const result = await serviceAlert.getAlert(datoAlert);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json(dto.error(error.message));
    }
};

const setAlert = async (req, res = response) => {
    const datoAlert = req.body;
    try {
        const result = await serviceAlert.setAlert(datoAlert);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json(dto.error(error.message));
    }
};

module.exports = {
    getAlert,
    setAlert,
};
