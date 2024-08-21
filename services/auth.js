const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (email, name, password) => {
    try {
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            throw new Error('El usuario ya existe');
        }

        usuario = new Usuario({ email, name, password });

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name, usuario.email);

        return {
            uid: usuario.id,
            name: usuario.name,
            token,
        };
    } catch (error) {
        throw error;
    }
};

const loginUsuario = async (email = null, password = null) => {
    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            throw new Error('El usuario no existe con ese email');
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            throw new Error('Password incorrecto');
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name, usuario.email);
        return {
            uid: usuario.id,
            name: usuario.name,
            email: usuario.email,
            token,
        };
    } catch (error) {
        throw error;
    }
};

const revalidarToken = async (uid, name, email) => {
    // Generar JWT
    const token = await generarJWT(uid, name, email);
    return {
        token,
        uid,
        name,
        email,
    };
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
};
