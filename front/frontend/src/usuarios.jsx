import React, { useEffect, useState } from "react";
import * as API from './servicios/servicios';
import { Link } from "react-router-dom";

export function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    API.getUsuarios().then(setUsuarios);
  }, []);

  const buscador = (e) => {
    setBusqueda(e.target.value);
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre_usuario.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatearFecha = (fecha) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString(undefined, options);
  };
  const handleVerInfoClick = (usuarioId) => {
    // Aquí puedes realizar acciones relacionadas con el clic, como navegar a la página de detalles o mostrar un modal.
    console.log(`Clic en "Ver info" para el usuario con ID ${usuarioId}`);
  };
  

  return (
    <>
      <img
        src="./lux.PNG"
        className="logos"
        style={{
          width: "50px",
          height: "auto",
          border: "2px solid #333",
          borderRadius: "50%",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
        }}
      />
      <div>
        <Link to="/menu">Volver al Menu</Link>
      </div>
      <div>
        <nav class="navbar bg-body-tertiary">
          <div class="container-fluid">
            <a class="navbar-brand"></a>
            <form class="d-flex" role="search">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Buscar"
                aria-label="Search"
                value={busqueda}
                onChange={buscador}
              />
            </form>
          </div>
        </nav>
        <table class="table table-bordered">
          <thead className="table-group-divider">
            <tr className="tt">
              <td>Id Usuario</td>
              <td>Nombre</td>
              <td>Apellido </td>
              <td>Telefono</td>
              <td>Estado </td>
              <td>Membresia</td>
              <td>Vencimiento</td>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {usuariosFiltrados.map((u) => (
              <tr key={u.usuario_id}>
                <td>{u.usuario_id}</td>
                <td>{u.nombre_usuario}</td>
                <td>{u.apellido}</td>
                <td>{u.telefono}</td>
                <td>{u.Estado_usuario}</td>
                <td>{u.Membresia}</td>
                <td>{formatearFecha(u.fecha_vencimiento)}</td>
                <td><button>Pagar</button></td>          
                <td><Link to={`/usuarios/${u.usuario_id}`} onClick={() => handleVerInfoClick(u.usuario_id)}>Ver info</Link></td>
        
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
