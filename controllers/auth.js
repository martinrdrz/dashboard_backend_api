const { response } = require('express');
const serviceAuth = require('../services/auth');
const dto = require('../dto/dto');

const crearUsuario = async (req, res = response) => {
    const { email, name, password } = req.body;
    try {
        const result = await serviceAuth.crearUsuario(email, name, password);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json(dto.error(error.message));
    }
};

const loginUsuario = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const result = await serviceAuth.loginUsuario(email, password);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json(dto.error(error.message));
    }
};

const revalidarToken = async (req, res = response) => {
    const { uid, name, email } = req;

    // Generar JWT
    const result = await serviceAuth.revalidarToken(uid, name, email);
    return res.status(200).json(dto.ok(result));
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
};
