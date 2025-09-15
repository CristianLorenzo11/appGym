import React, { useEffect, useState } from "react";
import * as API from './servicios/servicios';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';


export function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    API.getUsuarios().then(setUsuarios);
    API.getPagos().then(setPagos);
  }, []);

  const buscador = (e) => setBusqueda(e.target.value);

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre_usuario.toLowerCase().includes(busqueda.toLowerCase())
  );

  const enviarWhatsApp = (usuario) => {
    const telefono = usuario.telefono.replace(/\D/g, "");
    const vencimiento = pagos
      .filter((p) => p.usuario_id === usuario.usuario_id)
      .reduce((fechaMasLejana, pago) => {
        const fechaVencimiento = new Date(pago.fecha_vencimiento);
        return fechaVencimiento > fechaMasLejana ? fechaVencimiento : fechaMasLejana;
      }, new Date(0));

    const tieneVencimiento = vencimiento.getTime() !== new Date(0).getTime();
    const mensaje = tieneVencimiento
      ? `Hola ${usuario.nombre_usuario}, te escribimos desde CL-FITNESS para avisarte que tu vencimiento es el ${vencimiento.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}.`
      : `Hola ${usuario.nombre_usuario}, te escribimos desde CL-FITNESS.`;

    const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

const eliminarUsuario = async (usuario_id) => {
  const resultado = await Swal.fire({
    title: '¿Eliminar usuario?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (resultado.isConfirmed) {
    await API.deleteUsuario(usuario_id);
    const nuevaLista = usuarios.filter((u) => u.usuario_id !== usuario_id);
    setUsuarios(nuevaLista);

    Swal.fire({
      title: '¡Eliminado!',
      text: 'El usuario ha sido eliminado correctamente.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  }
};
const mostrarInfoUsuario = (usuario) => {
  const vencimiento = pagos
    .filter((p) => p.usuario_id === usuario.usuario_id)
    .reduce((fechaMasLejana, pago) => {
      const fechaVencimiento = new Date(pago.fecha_vencimiento);
      return fechaVencimiento > fechaMasLejana ? fechaVencimiento : fechaMasLejana;
    }, new Date(0));

  const vencimientoTexto = vencimiento.getTime() !== new Date(0).getTime()
    ? vencimiento.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : "Sin datos";

  Swal.fire({
    title: `${usuario.nombre_usuario} ${usuario.apellido}`,
    html: `
      <p><strong>Teléfono:</strong> ${usuario.telefono}</p>
      <p><strong>Vencimiento:</strong> ${vencimientoTexto}</p>
    `,
    icon: 'info',
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#3085d6',
  });
};

  return (
    <>
      <style>{`
        .fila-vencida {
          background-color: rgb(247, 7, 7) !important;
          color: rgb(235, 201, 12) !important;
          font-weight: bold;
        }
        .fila-proximo-vencimiento {
          background-color: rgb(62, 245, 6) !important;
          color: rgb(85, 85, 0) !important;
          font-weight: bold;
        }
        .logos {
          width: 50px;
          height: auto;
          border: 2px solid #333;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
        .add {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .add:hover {
          background-color: #218838;
        }
        .btn-eliminar {
          background-color: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          color: red;
        }
      `}</style>

      <img src="./lux.PNG" className="logos" alt="Logo LuxGym" />
      <div><Link to="/menu">Volver al Menu</Link></div>

      <div>
        <nav>
          <div>
            <p>Usuarios</p>
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Buscar"
                aria-label="Search"
                value={busqueda}
                onChange={buscador}
              />
              <Link to={'/addusuarios'}>
                <button type="button" className="add">Agregar+</button>
              </Link>
            </form>
          </div>
        </nav>

        <table className="table table-bordered">
          <thead className="table-group-divider">
            <tr>
              <td>Nombre</td>
              <td>Apellido</td>
              <td>Teléfono</td>
              <td>Vencimiento</td>
              <td>Pagar</td>
              <td>Info</td>
              <td>WhatsApp</td>
              <td>Eliminar</td>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {usuariosFiltrados.map((u) => {
              const vencimiento = pagos
                .filter((p) => p.usuario_id === u.usuario_id)
                .reduce((fechaMasLejana, pago) => {
                  const fechaVencimiento = new Date(pago.fecha_vencimiento);
                  return fechaVencimiento > fechaMasLejana ? fechaVencimiento : fechaMasLejana;
                }, new Date(0));

              const tieneVencimiento = vencimiento.getTime() !== new Date(0).getTime();
              const vencimientoTexto = tieneVencimiento
                ? vencimiento.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                : "";

              const hoy = new Date();
              const diffTime = vencimiento.getTime() - hoy.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              const estaVencido = tieneVencimiento && vencimiento < hoy;
              const proximoAVencer = tieneVencimiento && diffDays > 0 && diffDays <= 4;

              let claseFila = "";
              if (estaVencido) claseFila = "fila-vencida";
              else if (proximoAVencer) claseFila = "fila-proximo-vencimiento";

              return (
                <tr key={u.usuario_id} className={claseFila}>
                  <td>{u.nombre_usuario}</td>
                  <td>{u.apellido}</td>
                  <td>{u.telefono}</td>
                  <td>{vencimientoTexto}</td>
                  <td><Link to={`/pagos/${u.usuario_id}`}><button>Pagar</button></Link></td>
                  <td><button onClick={() => mostrarInfoUsuario(u)}>ℹ️ Ver info</button></td>

                  <td><button onClick={() => enviarWhatsApp(u)}>📲 WhatsApp</button></td>
                  <td>
                    <button className="btn-eliminar" onClick={() => eliminarUsuario(u.usuario_id)}>🗑️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
