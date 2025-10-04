import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/Home"
import Contacto from "./views/Contacto"
import Nosotros from "./views/Nosotros"
import Tienda from "./views/Tienda"
import Login from "./views/Login"
import Perfil from "./views/Perfil"
import Pedidos from "./views/Pedidos"
import { Header } from "./components/Header"


export default function App() {
  return (
    <>
      <Router>
      <Header />
      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/pedidos" element={<Pedidos />} />
        </Routes>
      </main>
    </Router>

    </>
  )
}