import React, { useState, useEffect } from "react";
import "./pago.css";
import * as API from './servicios/servicios';
import { useParams } from "react-router-dom";

export function Pago() {
  const [monto, setMonto] = useState("");
  const [precio, setPrecio] = useState("");
  const [deuda, setDeuda] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [loading, setLoading] = useState(true);
  const { usuario_id } = useParams();
  const membresia_id = 1; // Este valor podría ser dinámico dependiendo de tu lógica

  useEffect(() => {
    traerDatos();
  }, []); // Ejecutará solo una vez al montar el componente

  useEffect(() => {
    const montoNumero = parseFloat(monto);
    const precioNumero = parseFloat(precio);

    if (!isNaN(montoNumero) && !isNaN(precioNumero)) {
      const nuevaDeuda = precioNumero - montoNumero;
      setDeuda(nuevaDeuda.toFixed(2));
    }
  }, [monto, precio]);

  const guardarmonto = async (event) => {
    event.preventDefault();

    if (!monto || !precio || !usuario_id || !fechaPago || !fechaVencimiento) {
      alert(
        "Todos los campos son obligatorios. Por favor, complete todos los campos."
      );
      return;
    }

    try {
      // Aquí asumo que tienes una función insertarPago en tu archivo servicios/servicios.js
      await API.AadPago({
        usuario_id,
        membresia_id,
        monto: parseFloat(monto),
        fecha_pago: fechaPago,
        fecha_vencimiento: fechaVencimiento,
        deuda: parseFloat(deuda), // Incluye el valor calculado directamente
      });

      // Puedes realizar alguna acción adicional después de insertar el pago, si es necesario
      alert("Pago insertado con éxito");
    } catch (error) {
      console.error("Error al insertar el pago:", error);
      // Puedes manejar el error de alguna manera, mostrar un mensaje, etc.
      alert("Error al insertar el pago. Por favor, intenta nuevamente.");
    }
  };

  const traerDatos = async () => {
    try {
      const costo = await API.getCosto(1);

      // Asegúrate de que estás accediendo correctamente a la propiedad 'costo' del objeto devuelto
      setPrecio(costo);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setLoading(false); // Asegurémonos de marcar que la carga ha terminado incluso en caso de error
    }
  };

  return (
    <>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div>
          <h2>Formulario de Pagos</h2>
          <form onSubmit={guardarmonto}>
            <label>ID Usuario</label>
            <input
              type="text"
              id="id_usuario"
              name="monto"
              value={usuario_id}
              disabled
            />
            <br />
            <label>Membresia </label>
            <input
              type="text"
              id="id_membresia"
              name="monto"
              value={membresia_id}
              disabled
            />
            <br />
            <label htmlFor="fecha_pago">Fecha de Pago:</label>
            <input
              type="date"
              id="fecha_pago"
              name="fecha_pago"
              value={fechaPago}
              onChange={(event) => setFechaPago(event.target.value)}
              required
            />
            <br />

            <label htmlFor="fecha_vencimiento">Vencimiento:</label>
            <input
              type="date"
              id="fecha_vencimiento"
              name="fecha_vencimiento"
              value={fechaVencimiento}
              onChange={(event) => setFechaVencimiento(event.target.value)}
              required
            />
            <br />

            <label htmlFor="precio">Precio:</label>
            <input
              type="text"
              id="precio"
              name="precio"
              value={precio}
              onChange={(event) => setPrecio(event.target.value)}
              required
            />
            <br />

            <label htmlFor="monto">Monto:</label>
            <input
              type="text"
              id="monto"
              name="monto"
              value={monto}
              onChange={(event) => setMonto(event.target.value)}
              required
            />
            <br />

            <label htmlFor="deuda">Deuda:</label>
            <input
              type="text"
              id="deuda"
              name="deuda"
              value={deuda}
              required
              disabled
            />
            <br />

            <input
              type="submit"
              value="Insertar Pago"
              onClick={guardarmonto} // Asigna la función al evento onClick
            />
          </form>
        </div>
      )}
    </>
  );
}
