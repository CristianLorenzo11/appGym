import React, { useState, useEffect } from "react";
import "./Addusuario.css";

export function Addusuarios() {
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    direccion: "",
    telefono: "",
    id_estado: 1,
  });

  const [mensaje, setMensaje] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [exito, setExito] = useState(false);

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  let nuevoValor = value;

  // Convertir a mayúsculas solo para ciertos campos
  if (["nombre", "apellido", "direccion", "email"].includes(name)) {
    nuevoValor = value.toUpperCase();
  }

  setUsuario((prevUsuario) => ({
    ...prevUsuario,
    [name]: name === "id_estado" ? Number(nuevoValor) : nuevoValor,
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario.nombre || !usuario.apellido || !usuario.email) {
      setMensaje("Por favor, completa los campos Nombre, Apellido y Email.");
      setExito(false);
      setMostrarModal(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:2000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(`Usuario creado con éxito. ID: ${data.usuario_id}`);
        setExito(true);
        setMostrarModal(true);
        setUsuario({
          nombre: "",
          apellido: "",
          email: "",
          direccion: "",
          telefono: "",
          id_estado: 1,
        });
      } else if (res.status === 409) {
        setMensaje(data.mensaje || "El usuario con ese nombre y apellido ya existe.");
        setExito(false);
        setMostrarModal(true);
      } else {
        setMensaje(data.mensaje || "Error al crear usuario.");
        setExito(false);
        setMostrarModal(true);
      }
    } catch (error) {
      console.error("Error en fetch:", error);
      setMensaje("Error de comunicación con el servidor.");
      setExito(false);
      setMostrarModal(true);
    }
  };

  useEffect(() => {
    let timer;
    if (mostrarModal && exito) {
      timer = setTimeout(() => {
        setMostrarModal(false);
        window.location.href = "/usuarios";
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [mostrarModal, exito]);

  return (
    <>
      <style>{`
        .form {
          max-width: 400px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
            background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          font-family: Arial, sans-serif;
        }
        label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
        }
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        select {
          width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  color: black;
  font-size: 0.95rem;
        }

        button {
          background-color: #28a745;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background-color: #218838;
        }
        /* Modal styles */
        .modal {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }
        .modal-content {
          background: white;
          padding: 20px 30px;
          border-radius: 8px;
          max-width: 300px;
          text-align: center;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
          font-size: 18px;
          color: #333;
          position: relative;
        }
        .modal-content.success {
          border-left: 6px solid #28a745;
        }
        .modal-content.error {
          border-left: 6px solid #dc3545;
        }
      `}</style>

      <div>
        <h2>Agregar Usuario</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Nombre*:
            <input
              type="text"
              name="nombre"
              value={usuario.nombre}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Apellido*:
            <input
              type="text"
              name="apellido"
              value={usuario.apellido}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Email*:
            <input
              type="email"
              name="email"
              value={usuario.email}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Dirección:
            <input
              type="text"
              name="direccion"
              value={usuario.direccion}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Teléfono:
            <input
              type="text"
              name="telefono"
              value={usuario.telefono}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Estado:
            <select name="id_estado" value={usuario.id_estado} onChange={handleInputChange}>
              <option value="">Seleccione un estado</option>
              <option value="1">Activo</option>
              <option value="2">Inactivo</option>
            </select>
          </label>

          <button type="submit" >Agregar Usuario</button>
        </form>

        {mostrarModal && (
          <div
            className="modal"
            onClick={() => !exito && setMostrarModal(false)}
          >
            <div className={`modal-content ${exito ? "success" : "error"}`} onClick={e => e.stopPropagation()}>
              {mensaje}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
