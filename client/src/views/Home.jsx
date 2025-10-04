import { Header } from "../components/Header"
import { Llamativo } from "../components/Llamativo"
import { ProductoSeccion } from "../components/ProductoSeccion"
import { Footer } from "../components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <Llamativo />
        <ProductoSeccion />
      </main>
      <Footer />
    </div>
  )
}
