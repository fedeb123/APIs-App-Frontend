import { Route, Routes } from "react-router-dom"
import Home from "./views/Home"
import Contacto from "./views/Contacto"
import Nosotros from "./views/Nosotros"
import Tienda from "./views/Tienda"
import Login from "./views/Login"
import Register from "./views/Register"
import Perfil from "./views/Perfil"
import Pedidos from "./views/Pedidos"
import Admin from "./views/Admin"
import { Header } from "./components/Header"


export default function App() {
  return (
    <>
      <Header/>
      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/contacto" element={<Contacto/>} />
          <Route path="/nosotros" element={<Nosotros/>} />
          <Route path="/tienda" element={<Tienda/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/perfil" element={<Perfil/>} />
          <Route path="/pedidos" element={<Pedidos/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </main>
    </>
  )
}