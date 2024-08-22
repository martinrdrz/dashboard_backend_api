const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN);
        //El siguiente objeto es el segundo parametro del metodo connect anterior, pero en las versiones nuevas da error, por eso se eliminó
        // {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // }

        console.log('DB Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar BD');
    }
};

module.exports = {
    dbConnection,
};
