const express = require('express');
const router = express();
const bcrypt = require('bcrypt');

// Conexión a la base de datos
const mysqlConexion = require('../base de datos/bd');
const bodyParser = require('body-parser');

// ENDPOINT PARA VER UN admin
router.get('/usuario', (req, res) => {
    mysqlConexion.query("SELECT * FROM administradores", (error, registro) => {
        if (error) {
            console.log("el error es", error);
        } else {
            res.json(registro);
        }
    });
});

// ENDPOINT PARA REGISTRAR UN admin
router.post("/registro", bodyParser.json(), (req, res) => {

    const { nombre, apellido, user, pass, rol } = req.body;
    let hash = bcrypt.hashSync(pass, 10);


    if (!nombre) {
        return res.json({
            status: false,
            mensaje: "EL NOMBRE ES UN CAMPO OBLIGATORIO "
        });
    }
    if (!apellido) {
        return res.json({
            status: false,
            mensaje: "EL APELLIDO ES UN CAMPO OBLIGATORIO "
        });
    }

    mysqlConexion.query("SELECT * FROM  administradores WHERE user=?", [user], (error, usuario) => {
        if (error) {
            console.log("el error es", error);
        } else {
            if (usuario.length > 0) {
                res.json({
                    status: false,
                    mensaje: "EL USUARIO " + user + " YA EXISTE "
                });
            } else {
                mysqlConexion.query("INSERT INTO administradores (nombre, apellido, user, pass,rol) VALUES (?, ?, ?, ?, ?)", [nombre, apellido, user, hash, rol], (error, registro) => {
                    if (error) {
                        console.log("ERROR EN EL REGISTRO ", error);
                    } else {
                        res.json({
                            status: true,
                            mensaje: "EL USUARIO " + user + " SE CARGO CORRECTAMENTE "
                        });
                    }
                });
            }
        }
    });
});

module.exports = router; // Para exportar la ruta
