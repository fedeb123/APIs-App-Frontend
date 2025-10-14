import { useEffect, useState } from "react"
import { Card } from "./ui/Card"
import useFetch from "../hooks/useFetch"

const imagesUrl  = import.meta.env.VITE_APP_API_IMAGES_URL


export function ProductoSeccion() {

const [products, setProducts] = useState([])
const { response: productsContent, loading, error } = useFetch('productos/validos', 'GET')


useEffect(() => {
  if (productsContent) {
    setProducts(productsContent?.content ?? [])
  }
}, [productsContent])

useEffect(() => {
  if (error) {
    alert(`Ha ocurrido un error: ${error}`)
  }
}, [error])

  return (
    <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <h2 className="mb-10 text-3xl font-bold md:text-4xl">Nuestra Seleccion de Productos</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 3).map((product) => (
          <Card
            key={product.id}
            className={`group overflow-hidden rounded-3xl border-0 ${product.bgColor} transition-transform hover:scale-[1.02]`}
          >
            <div className="aspect-square p-8">
              <img
                src={product.imageUrl ? imagesUrl + product.imageUrl : '/placeholder.svg'}
                alt={product.nombre}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="bg-background p-6">
              <h3 className="mb-2 text-xl font-bold">{product.nombre}</h3>
              <p className="text-sm text-muted-foreground">{product.descripcion}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
