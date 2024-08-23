const { response } = require('express');
const jwt = require('jsonwebtoken');
const dto = require('../dto/dto');

const validarJWT = (req, res = response, next) => {
    // x-token headers
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json(dto.error('No hay token en la petición'));
    }

    try {
        const { uid, name, email } = jwt.verify(token, process.env.SECRET_JWT_SEED);

        req.uid = uid;
        req.name = name;
        req.email = email;
    } catch (error) {
        return res.status(401).json(dto.error('Token no válido'));
    }
    next();
};

module.exports = {
    validarJWT,
};
