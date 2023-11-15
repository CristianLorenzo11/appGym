import React from "react";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <img
        src="./lux.PNG"
        
        className="logo"
        style={{
          width: "200px", // Ajusta el tamaño de acuerdo a tus necesidades
          height: "auto",
          border: "2px solid #333", // Puedes cambiar el color y el grosor del borde 
         borderRadius: "50%", // Esto hará que la imagen sea circular, ajusta según desees
         boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)", // Agrega un sombreado para el efecto 3D
        }}
      />
      <h2>Bienvenido</h2>
      <Link> Ingresar </Link>
      
    </div>
  );
}
