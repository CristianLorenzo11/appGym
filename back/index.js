const express= require('express');
const app= express();
const port = 2000;
const morgan= require('morgan');

const conexion= require('./base de datos/bd');

app.use(morgan('dev'));
 
// Middleware para parsear JSON
app.use(express.json());

// CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization'); 
    res.setHeader('Access-Control-Allow-Credentials', true); 
    next();
});

// Rutas
app.use(require('./rutas/routes'));
app.use(require('./rutas/registro'));
app.use(require('./rutas/login'));

app.listen(port, () => {
    console.log("El servidor está funcionando en puerto " + port);
});
