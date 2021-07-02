const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");


const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existEmail = await Usuario.findOne({ email });

        if (existEmail) {

            return res.status(400).json({
                ok:false,
                msg: 'El correo ya está registrado'
            }

            )
        }


        const usuario = new Usuario (req.body);

        // ENCRIPTAR PASSWORD

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        

        await usuario.save();

        // Generar mi JWT

        const token = await generarJWT(usuario.id);


        res.json({

            ok: true,
            msg: 'Crear usuario!',
            usuario,
            token
        } );

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }

}




const login = async (req, res = response) => {

    const { email, password } = req.body;

    try{

        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {

            return res.status(400).json({
                ok:false,
                msg: 'El email no existe'
            });
        }


        //Validar Password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password);

        if (!validPassword) {

            return res.status(400).json({
                ok:false,
                msg: 'El password es incorrecto'
            });
        }

        const token = await generarJWT(usuarioDB.id);

        res.json({

            ok: true,
            msg: 'Usuario con Login!',
            usuarioDB,
            token
        } );



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el Adminitrador'        
        } );

    }
}


const renewToken = async( req, res = response) => {

    const uid = req.uid;

try{

    const usuarioDB = await Usuario.findById( uid );

    if (!usuarioDB) {

        return res.status(400).json({
            ok:false,
            msg: 'El usuario no existe'
        });

    }

    const token = await generarJWT(uid);

    res.json({
        ok:true,
        usuarioDB,
        token

    })


} catch(error){
    console.log(error);
    return res.status(500).json({
        ok: false,
        msg: 'Hable con el Adminitrador'        
    } );


}


  

}

module.exports = { crearUsuario, login, renewToken }