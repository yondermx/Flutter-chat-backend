const moongose = require('mongoose');

const dbConnection = async() => {


    try{

        await moongose.connect(process.env.DB_CNN,{
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
            }
        );



        console.log('DB Online');

    } catch (error) {

        console.log(error);
        throw new Error('Error en la base de datos, fallo no esperado');

    }


}



module.exports = { dbConnection}