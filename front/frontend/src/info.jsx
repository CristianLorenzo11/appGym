import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as API from './servicios/servicios';
import './Info.css';  // Importa tu archivo CSS
export function Info() {
  const { usuario_id } = useParams();
  const [nombre, setNombre] = useState({});

  useEffect(() => {
    traerDatos();
  }, [usuario_id]);

  const traerDatos = async () => {
    try {
      const datos = await API.getusuarioID(usuario_id);
      setNombre(datos[0]);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
    }
  };

  return (
    <>
    
   <div className="detalles-usuario">
      <h2>Detalles del Usuario</h2>
      <p><strong>ID:</strong> {nombre.usuario_id}</p>
      <p><strong>Nombre:</strong> {nombre.nombre}</p>
      <p><strong>Apellido:</strong> {nombre.apellido}</p>
      <p><strong>Email:</strong> {nombre.email}</p>
      <p><strong>Dirección:</strong> {nombre.direccion}</p>
      <p><strong>Teléfono:</strong> {nombre.telefono}</p>
      <p><strong>Estado:</strong> {nombre.Estado_usuario}</p>
      
    </div>
    <div>
        <Link to="/usuarios">Volver</Link>
      </div>
      {/* Agrega más detalles según sea necesario */}
    </>
  );
}


