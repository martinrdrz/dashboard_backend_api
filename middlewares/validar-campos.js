const { response } = require('express');
const { validationResult } = require('express-validator');
const dto = require('../dto/dto');

const validarCampos = (req, res = response, next) => {
    // manejo de errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(dto.error(errors.mapped()));
    }
    next();
};

module.exports = {
    validarCampos,
};
