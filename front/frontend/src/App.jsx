import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { Menu } from "./menu";
import { Usuario } from "./usuarios";

function App() {

  return (
    <>
     <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/menu" element={<Menu/>} />
          <Route path="/usuarios" element={<Usuario/>} />

    </Routes>
    </>
  )
}

export default App
