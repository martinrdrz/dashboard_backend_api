const getSistemas = async () => {
    try {
        //const sistema = await Sistema.find({ email });
        const sistemas = { datos: 'datos del sistema' };
        if (!sistemas) {
            throw new Error('No hay datos de sistemas');
        }
        return sistemas;
    } catch (error) {
        throw error;
    }
};

const getSistema = async (email = null) => {
    try {
        //const sistema = await Sistema.findOne({ email });
        const sistema = { datos: 'datos del sistema' };
        if (!sistema) {
            throw new Error('No hay datos de sistemas');
        }

        return sistema;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getSistemas,
    getSistema,
};
