const express = require('express')
const router= express()
const bycript = require ('bcrypt')
const jwt = require("jsonwebtoken")

// la conexion con la base de datos
const mysqlConexion = require('../base de datos/bd');
const bodyParser = require('body-parser');


//aca comenzamos el endpoint para login 
router.post("/login",bodyParser.json(), (req, res)=>{
    const{user,pass} =req.body
if(!user){
    res.json({
        status: false,
        mensaje: "EL USUARIO ES OBLIGATORIO "

    }) 

}
if(!pass){
    res.json({
        status: false,
        mensaje: "EL PASS ES OBLIGATORIO "

    }) 

}
mysqlConexion.query( "SELECT * FROM  administradores WHERE user=?",[user],(error,usuario)=>{
       
    if(error){
        console.log("el error es",error)
    }
    else{
        if(usuario.length>0){
            const comparacion = bycript.compareSync(pass, usuario[0].pass)
        if(comparacion){
            jwt.sign({usuario},"bocajuniors", (error, token)=>{ //aca ponemos la palabra secreta del token 

                res.json({
                    status: true,
                    mensaje: "Ingreso Correctamente",
                    datos: usuario,
                    token: token
    

            }
            )
            
            })

        }  
        else{ res.json({
            status: false,
            mensaje: "la contraseña es incorrecta "

        })

        }
        
        } 
            
            else {
                res.json({
                    status: false,
                    mensaje: "EL USUARIO NO EXISTE "
    
                })
            }
        }
        })




})


module.exports= router; //para exportar la ruta