const { Schema, model } = require('mongoose');

const SistemaSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        nombre: {
            type: String,
            required: true,
        },
        telefono: {
            type: String,
            required: true,
        },
        cant_sistemas: {
            type: Number,
            required: true,
        },

        // No se definen específicamente los mensajes, lo que permite una estructura plana, sin anidamiento y dinamica
        // Permite que el documento contenga cualquier campo no definido explícitamente
    },
    { strict: false }
);

module.exports = model('Sistema', SistemaSchema);
