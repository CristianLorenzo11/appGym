import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { Menu } from "./menu";
import { Usuario } from "./usuarios";
import { Info } from "./info";
import { Pago } from "./generarPago";

function App() {

  return (
    <>
     <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/menu" element={<Menu/>} />
          <Route path="/usuarios" element={<Usuario/>} />
          <Route path="/usuarios/:usuario_id" element={<Info/>} />
          <Route path="/pagos/:usuario_id" element={<Pago/>} />

    </Routes>
    </>
  )
}

export default App
