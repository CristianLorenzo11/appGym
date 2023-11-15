const express= require ('express')
const app= express()
const port = 2000;
const morgan= require ('morgan')

const conexion= require('./base de datos/bd')
app.use(morgan('dev'));
app.set('puerto', 2000);
app.listen(port, () => {
    console.log("El servidor está funcionando"); // Aviso de que el servidor está funcionando correctamente
});

app.get('/', (req, res) => {
    res.send("Esta es la ruta de inicio del proyecto del gim ");
});

app.use(require('./rutas/routes'))
app.use(require('./rutas/registro'));
app.use(require('./rutas/login'));