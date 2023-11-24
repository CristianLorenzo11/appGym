const express = require('express');
const mysql = require('mysql'); // Asegúrate de haber configurado la conexión a tu base de datos MySQL
const app = express();


// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Configura la conexión a la base de datos
const db = require('../base de datos/bd')

// Ruta para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  db.query(`SELECT 
  U.usuario_id,
  U.nombre AS nombre_usuario,
  U.apellido AS apellido,
  U.email AS email,
  U.direccion AS direccion,
  U.telefono AS telefono,
  M.nombre AS Membresia,
  p.fecha_vencimiento,
  E.estadousuario AS Estado_usuario
FROM Usuarios AS U
INNER JOIN Membresias AS M ON U.membresia_id = M.membresia_id
INNER JOIN Estado AS E ON U.id_estado = E.idestado
INNER JOIN pagos AS p ON U.pagosid = p.pago_id;

  `, (err, resultados) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error al recuperar los usuarios' });
    } else {
      res.json(resultados);
    }
  });
});



// Ruta para obtener un usuario por ID
app.get('/usuarios/:id', (req, res) => {
  const usuarioId = req.params.id;
  db.query('SELECT * FROM Usuarios WHERE usuario_id = ?', [usuarioId], (err, resultados) => {
    if (err) {
      throw err;
    }
    if (resultados.length > 0) {
      res.json(resultados[0]);
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  });
});

app.get('/usuarios/nombre/:inicialesNombre', (req, res) => {
  const inicialesNombre = req.params.inicialesNombre + '%'; // Agregamos '%' para buscar iniciales coincidentes al inicio
  db.query('SELECT * FROM Usuarios WHERE nombre LIKE ?', [inicialesNombre], (err, resultados) => {
    if (err) {
      throw err;
    }
    if (resultados.length > 0) {
      res.json(resultados);
    } else {
      res.status(404).json({ mensaje: 'Usuarios no encontrados' });
    }
  });
});








// Ruta para crear un nuevo usuario
app.post('/usuarios', (req, res) => {
  const nuevoUsuario = req.body;
  db.query('INSERT INTO Usuarios SET ?', nuevoUsuario, (err, resultado) => {
    if (err) {
      throw err;
    }
    res.json({ mensaje: 'Usuario creado con éxito', usuario_id: resultado.insertId });
  });
});


// Ruta para actualizar un usuario por ID
app.put('/usuarios/:id', (req, res) => {
  const usuarioId = req.params.id;
  const datosActualizados = req.body;
  db.query('UPDATE Usuarios SET ? WHERE usuario_id = ?', [datosActualizados, usuarioId], (err, resultado) => {
    if (err) {
      throw err;
    }
    res.json({ mensaje: `Usuario con ID ${usuarioId} actualizado con éxito` });
  });
});

// Ruta para eliminar un usuario por ID
app.delete('/usuarios/:id', (req, res) => {
  const usuarioId = req.params.id;
  db.query('DELETE FROM Usuarios WHERE usuario_id = ?', [usuarioId], (err, resultado) => {
    if (err) {
      throw err;
    }
    res.json({ mensaje: `Usuario con ID ${usuarioId} eliminado con éxito` });
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////
// Obtener todas las membresías
app.get('/membresias', (req, res) => {
  db.query('SELECT * FROM Membresias', (err, resultados) => {
    if (err) {
      throw err;
    }
    res.json(resultados);
  });
});

// Obtener una membresía por ID
app.get('/membresias/:id', (req, res) => {
  const membresiaId = req.params.id;
  db.query('SELECT * FROM Membresias WHERE membresia_id = ?', [membresiaId], (err, resultados) => {
    if (err) {
      throw err;
    }
    if (resultados.length > 0) {
      res.json(resultados[0]);
    } else {
      res.status(404).json({ mensaje: 'Membresía no encontrada' });
    }
  });
});

// Crear una nueva membresía
app.post('/membresias', (req, res) => {
  const nuevaMembresia = req.body;
  db.query('INSERT INTO Membresias SET ?', nuevaMembresia, (err, resultado) => {
    if (err) {
      throw err;
    }
    res.json({ mensaje: 'Membresía creada con éxito', membresia_id: resultado.insertId });
  });
});

// Actualizar una membresía por ID
app.put('/membresias/:id', (req, res) => {
  const membresiaId = req.params.id;
  const datosActualizados = req.body;
  db.query('UPDATE Membresias SET ? WHERE membresia_id = ?', [datosActualizados, membresiaId], (err, resultado) => {
    if (err) {
      throw err;
    }
    res.json({ mensaje: `Membresía con ID ${membresiaId} actualizada con éxito` });
  });
});

// Eliminar una membresía por ID
app.delete('/membresias/:id', (req, res) => {
  const membresiaId = req.params.id;
  db.query('DELETE FROM Membresias WHERE membresia_id = ?', [membresiaId], (err, resultado) => {
    if (err) {
      throw err;
    }
    res.json({ mensaje: `Membresía con ID ${membresiaId} eliminada con éxito` });
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////
app.get('/pagos', (req, res) => {
  db.query(`
    SELECT 
      P.pago_id,
      U.nombre AS nombre_usuario,
      M.nombre AS nombre_membresia,
      DATE_FORMAT(P.fecha_pago, "%Y-%m-%d") AS fecha_pago,
      DATE_FORMAT(P.fecha_vencimiento, "%Y-%m-%d") AS fecha_vencimiento,
      P.monto
    FROM Pagos AS P
    INNER JOIN Usuarios AS U ON P.usuario_id = U.usuario_id
    INNER JOIN Membresias AS M ON P.membresia_id = M.membresia_id
  `, (err, resultados) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error al recuperar los pagos' });
    } else {
      res.json(resultados);
    }
  });
});



// Obtener un pago por ID
app.get('/pagos/:id', (req, res) => {
  const pagoId = req.params.id;
  db.query('SELECT * FROM Pagos WHERE pago_id = ?', [pagoId], (err, resultados) => {
    if (err) {
      throw err;
    }
    if (resultados.length > 0) {
      res.json(resultados[0]);
    } else {
      res.status(404).json({ mensaje: 'Pago no encontrado' });
    }
  });
});

app.post('/pagos', (req, res) => {
  const nuevoPago = req.body;

  // Asegúrate de que las fechas no contengan las horas y minutos.
  nuevoPago.fecha_pago = nuevoPago.fecha_pago.substring(0, 10); // Solo se mantiene "YYYY-MM-DD".
  nuevoPago.fecha_vencimiento = nuevoPago.fecha_vencimiento.substring(0, 10); // Solo se mantiene "YYYY-MM-DD".

  db.query('INSERT INTO Pagos SET ?', nuevoPago, (err, resultado) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error al crear el pago' });
    } else {
      res.status(201).json({ mensaje: 'Pago creado con éxito', pago_id: resultado.insertId });
    }
  });
});


// Actualizar un pago por ID
app.put('/pagos/:id', (req, res) => {
  const pagoId = req.params.id;
  const datosActualizados = req.body;
  db.query('UPDATE Pagos SET ? WHERE pago_id = ?', [datosActualizados, pagoId], (err, resultado) => {
    if (err) {
      throw err;
    }
    res.json({ mensaje: `Pago con ID ${pagoId} actualizado con éxito` });
  });
});

// Eliminar un pago por ID
app.delete('/pagos/:id', (req, res) => {
  const pagoId = req.params.id;
  db.query('DELETE FROM Pagos WHERE pago_id = ?', [pagoId], (err, resultado) => {
    if (err) {
      throw err;
    }
    res.json({ mensaje: `Pago con ID ${pagoId} eliminado con éxito` });
  });
});


////////////////////////////////////////////////////////////////////
// Obtener todos los pagos mensuales
app.get('/pagos-mensuales', (req, res) => {
  db.query('SELECT * FROM PagosMensuales', (err, resultados) => {
    if (err) {
      throw err;
    }
    res.json(resultados);
  });
});

// Obtener un pago mensual por ID
app.get('/pagos-mensuales/:id', (req, res) => {
  const pagoMensualId = req.params.id;
  db.query('SELECT * FROM PagosMensuales WHERE pago_mensual_id = ?', [pagoMensualId], (err, resultados) => {
    if (err) {
      throw err;
    }
    if (resultados.length > 0) {
      res.json(resultados[0]);
    } else {
      res.status(404).json({ mensaje: 'Pago mensual no encontrado' });
    }
  });
});

// Crear un nuevo pago mensual
app.post('/pagos-mensuales', (req, res) => {
  const nuevoPagoMensual = req.body;
  db.query('INSERT INTO PagosMensuales SET ?', nuevoPagoMensual, (err, resultado) => {
    if (err) {
      throw err;
    }
    res.json({ mensaje: 'Pago mensual creado con éxito', pago_mensual_id: resultado.insertId });
  });
});

// Actualizar un pago mensual por ID
app.put('/pagos-mensuales/:id', (req, res) => {
  const pagoMensualId = req.params.id;
  const datosActualizados = req.body;
  db.query('UPDATE PagosMensuales SET ? WHERE pago_mensual_id = ?', [datosActualizados, pagoMensualId], (err, resultado) => {
    if (err) {
      throw err;
    }
    res.json({ mensaje: `Pago mensual con ID ${pagoMensualId} actualizado con éxito` });
  });
});

// Eliminar un pago mensual por ID
app.delete('/pagos-mensuales/:id', (req, res) => {
  const pagoMensualId = req.params.id;
  db.query('DELETE FROM PagosMensuales WHERE pago_mensual_id = ?', [pagoMensualId], (err, resultado) => {
    if (err) {
      throw err;
    }
    res.json({ mensaje: `Pago mensual con ID ${pagoMensualId} eliminado con éxito` });
  });
});
//////////////////////////////////////////////////////////////////////
// Obtener todos los administradores
app.get('/administradores', (req, res) => {
  // Realiza una comprobación de autenticación y autorización aquí
  // Luego, realiza una consulta a la base de datos para obtener todos los administradores
  db.query('SELECT * FROM Administradores', (err, resultados) => {
    if (err) {
      throw err;
    }
    res.json(resultados);
  });
});

// Obtener un administrador por ID
app.get('/administradores/:id', (req, res) => {
  const adminId = req.params.id;
  // Realiza una comprobación de autenticación y autorización aquí
  // Luego, realiza una consulta a la base de datos para obtener el administrador con el ID proporcionado
  db.query('SELECT * FROM Administradores WHERE admin_id = ?', [adminId], (err, resultados) => {
    if (err) {
      throw err;
    }
    if (resultados.length > 0) {
      res.json(resultados[0]);
    } else {
      res.status(404).json({ mensaje: 'Administrador no encontrado' });
    }
  });
});
// Ruta para crear un nuevo administrador
app.post('/administradores', (req, res) => {
  // Realiza la lógica de autenticación y autorización aquí
  // Asegúrate de verificar si el usuario que realiza la solicitud tiene permisos para crear un administrador

  const nuevoAdministrador = req.body;
  
  // Realiza validaciones y verificaciones adicionales, si es necesario

  // A continuación, puedes insertar el nuevo administrador en la base de datos
  db.query('INSERT INTO Administradores SET ?', nuevoAdministrador, (err, resultado) => {
    if (err) {
      throw err;
    }
    res.json({ mensaje: 'Administrador creado con éxito', admin_id: resultado.insertId });
  });
});






module.exports= app; //para exportar la ruta