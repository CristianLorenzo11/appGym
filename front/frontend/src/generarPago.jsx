import React, { useState, useEffect } from "react";
import "./pago.css"
import { useParams } from "react-router-dom";

export function Pago() {
  const [monto, setMonto] = useState("");
  const [precio, setPrecio] = useState("");
  const [deuda, setDeuda] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const { usuario_id } = useParams();

  useEffect(() => {
    
    // Verificar si monto y precio son números válidos
    const montoNumero = parseFloat(monto);
    const precioNumero = parseFloat(precio);

    if (!isNaN(montoNumero) && !isNaN(precioNumero)) {
      // Calcular la deuda restando el monto al precio
      const nuevaDeuda = precioNumero - montoNumero;
      
      // Actualizar el estado de la deuda
      setDeuda(nuevaDeuda.toFixed(2)); // Redondear a dos decimales
    }
  }, [monto, precio]); // Se ejecutará cuando monto o precio cambien

  const guardarmonto = async (event) => {
    event.preventDefault();

    // Validar si se han completado todos los campos obligatorios
    if (!monto || !precio || !membresiaId || !fechaPago || !fechaVencimiento) {
      alert(
        "Todos los campos son obligatorios. Por favor, complete todos los campos."
      );
      return;
    }

    // Puedes realizar otras acciones aquí, como enviar los datos al servidor, etc.
  };

  return (
    <>
      <div>
        <h2>Formulario de Pagos</h2>
        <form onSubmit={guardarmonto}>
          <label> ID Usuario</label>
          <input
          type="text"
          id="id usuario"
          name="monto"
          value={usuario_id}>
          </input>

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

          <label htmlFor="fecha_vencimiento"> Vencimiento:</label>
          <input
            type="date"
            id="fecha_vencimiento"
            name="fecha_vencimiento"
            value={fechaVencimiento}
            onChange={(event) => setFechaVencimiento(event.target.value)}
            required
          />
          <br />

          <label htmlFor="monto">Precio:</label>
          <input
            type="text"
            id="monto"
            name="monto"
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
            onChange={() => {}}
            required
            disabled
          />
          <br />

          <input type="submit" value="Insertar Pago" />
        </form>
      </div>
    </>
  );
}
