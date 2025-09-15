import React, { useState, useEffect } from "react";
import "./pago.css";
import * as API from './servicios/servicios';
import { useParams, useNavigate } from "react-router-dom";

export function Pago() {
  const { usuario_id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [monto, setMonto] = useState("");
  const [precio, setPrecio] = useState("");
  const [deuda, setDeuda] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagoGuardado, setPagoGuardado] = useState(false);
  const [numeroWhatsAppManual, setNumeroWhatsAppManual] = useState("");
  const [mostrarInputManual, setMostrarInputManual] = useState(false);

  const membresia_id = 1;

  useEffect(() => {
    async function cargarDatos() {
      try {
        const usuarios = await API.getUsuarios();
        const usuarioEncontrado = usuarios.find(u => u.usuario_id.toString() === usuario_id);
        setUsuario(usuarioEncontrado || null);

        const costo = await API.getCosto(membresia_id);
        setPrecio(costo);

        setLoading(false);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setLoading(false);
      }
    }
    if (usuario_id) cargarDatos();
  }, [usuario_id]);

  useEffect(() => {
    const montoNum = parseFloat(monto);
    const precioNum = parseFloat(precio);
    if (!isNaN(montoNum) && !isNaN(precioNum)) {
      const nuevaDeuda = precioNum - montoNum;
      setDeuda(nuevaDeuda.toFixed(2));
    } else {
      setDeuda("");
    }
  }, [monto, precio]);

  useEffect(() => {
    if (fechaPago) {
      const fecha = new Date(fechaPago);
      fecha.setDate(fecha.getDate() + 30);
      setFechaVencimiento(fecha.toISOString().split("T")[0]);
    }
  }, [fechaPago]);

  const guardarmonto = async (event) => {
    event.preventDefault();

    if (!monto || !precio || !usuario_id || !fechaPago || !fechaVencimiento) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    if (isNaN(monto) || parseFloat(monto) < 0) {
      alert("El monto debe ser un número válido mayor o igual a 0.");
      return;
    }
    if (isNaN(precio) || parseFloat(precio) <= 0) {
      alert("El precio debe ser un número válido mayor a 0.");
      return;
    }

    try {
      await API.AadPago({
        usuario_id,
        membresia_id,
        monto: parseFloat(monto),
        fecha_pago: fechaPago,
        fecha_vencimiento: fechaVencimiento,
        deuda: parseFloat(deuda),
      });

      alert("Pago insertado con éxito");
      setPagoGuardado(true);
    } catch (error) {
      console.error("Error al insertar el pago:", error);
      alert("Error al insertar el pago.");
    }
  }; 

  const mensajeResumen = `Resumen de pago:\nCliente: ${usuario ? usuario.nombre_usuario + " " + usuario.apellido : ""}\nUsuario ID: ${usuario_id}\nMonto: $${monto}\nFecha de Pago: ${fechaPago}\nVencimiento: ${fechaVencimiento}\nDeuda: $${deuda}`;
 
  if (loading) return <p>Cargando...</p>;
  if (!usuario) return <p>Usuario no encontrado</p>;

  return (
    <div>
      <h2>Formulario de Pagos</h2>
      <form onSubmit={guardarmonto}>
        <div className="full-width">
          <label>Nombre del Cliente:</label>
          <input type="text" value={`${usuario.nombre_usuario} ${usuario.apellido}`} disabled className="full-width" />
        </div>

        <div>
          <label>ID Usuario:</label>
          <input type="text" value={usuario_id} disabled />
        </div>

        <div>
          <label>Membresía:</label>
          <input type="text" value={membresia_id} disabled />
        </div>

        <div>
          <label>Fecha de Pago:</label>
          <input
            type="date"
            value={fechaPago}
            onChange={(e) => setFechaPago(e.target.value)}
            required
            disabled={pagoGuardado}
          />
        </div>

        <div>
          <label>Vencimiento:</label>
          <input type="date" value={fechaVencimiento} disabled />
        </div>

        <div>
          <label>Precio:</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
            disabled={pagoGuardado}
          />
        </div>

        <div>
          <label>Monto:</label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
            disabled={pagoGuardado}
          />
        </div>

        <div>
          <label>Deuda:</label>
          <input type="text" value={deuda} disabled />
        </div>

        <div className="full-width">
          <input type="submit" value="Insertar Pago" disabled={pagoGuardado} />
        </div>
      </form>

      {pagoGuardado && (
        <div className="resumen-pago">
          <h3>Resumen del Pago</h3>
          <p>Cliente: <b>{usuario.nombre_usuario} {usuario.apellido}</b></p>
          <p>Vas a registrar un pago de <b>${monto}</b> el día <b>{fechaPago}</b></p>
          <p>Vencimiento: <b>{fechaVencimiento}</b></p>
          <p>Deuda: <b>${deuda}</b></p>

          {usuario.telefono ? (
            <button
              onClick={() => {
                const telefono = usuario.telefono.replace(/\D/g, "");
                const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensajeResumen)}`;
                window.open(url, "_blank");
                setTimeout(() => navigate("/usuarios"), 1500);
              }}
            >
              Enviar por WhatsApp
            </button>
          ) : (
            !mostrarInputManual ? (
              <button onClick={() => setMostrarInputManual(true)}>
                Ingresar número para enviar por WhatsApp
              </button>
            ) : (
              <div style={{ marginTop: "10px" }}>
                <input
                  type="text"
                  placeholder="Ingresá el número sin + ni espacios"
                  value={numeroWhatsAppManual}
                  onChange={(e) => setNumeroWhatsAppManual(e.target.value)}
                />
                <button
                  onClick={() => {
                    const telefono = numeroWhatsAppManual.replace(/\D/g, "");
                    const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensajeResumen)}`;
                    window.open(url, "_blank");
                    setTimeout(() => navigate("/usuarios"), 1500);
                  }}
                  style={{ marginLeft: "5px" }}
                >
                  Enviar mensaje
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
