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

// Configuración para CORS
app.use(function (req, res, next) {
    // Sitio web al que se le desea permitir la conexión
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Métodos de solicitud que se desean permitir
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    
    // Encabezados de solicitud que se desean permitir
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    
    // Establecer a verdadero si necesita que el sitio web incluya cookies en las solicitudes enviadas
    // a la API (por ejemplo, en caso de que use sesiones)
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    // Pasar a la siguiente capa de middleware
    next();
});

app.use(require('./rutas/routes'))
app.use(require('./rutas/registro'));
app.use(require('./rutas/login'));


