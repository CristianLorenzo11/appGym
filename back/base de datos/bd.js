const mysql = require('mysql')

const mysqlConexion= mysql.createConnection({ // creamos la conexion a la base de datos
    host:'localhost',
    user: 'root',
    password: 'root',
    database: 'gym_management'
});
mysqlConexion.connect(function(err){ //funcion para saber si hay error o si conecto correctamente
    if(err){
        console.log('Mi error de conexion es: ', err)
        return;
    }else{
        console.log('Mi conexión a la base de datos  se realizo correctamente')
    }
})

module.exports=mysqlConexion; // para exportar la variable de conexion