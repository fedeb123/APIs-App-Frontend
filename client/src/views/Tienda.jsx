import { useState } from "react"
import { Input } from "../components/ui/Input"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Search, ShoppingCart } from "lucide-react"

const products = [
  {
    id: 1,
    title: "Comida Premium para Perros",
    category: "alimentos",
    description: "Alimento balanceado de alta calidad con proteínas naturales.",
    image: "/bowl-of-premium-pet-food-kibble-on-teal-background.jpg",
    price: 45.99,
    stock: 23,
  },
  {
    id: 2,
    title: "Comida para Gatos",
    category: "alimentos",
    description: "Nutrición completa para gatos de todas las edades.",
    image: "/bowl-of-premium-pet-food-kibble-on-teal-background.jpg",
    price: 38.5,
    stock: 15,
  },
  {
    id: 3,
    title: "Pelota Interactiva",
    category: "juguetes",
    description: "Juguete resistente para horas de diversión.",
    image: "/colorful-pet-toys-rope-balls-on-light-blue-backgro.jpg",
    price: 12.99,
    stock: 45,
  },
  {
    id: 4,
    title: "Cuerda de Juego",
    category: "juguetes",
    description: "Perfecta para juegos de tira y afloja.",
    image: "/colorful-pet-toys-rope-balls-on-light-blue-backgro.jpg",
    price: 8.99,
    stock: 32,
  },
  {
    id: 5,
    title: "Collar de Cuero",
    category: "accesorios",
    description: "Collar elegante y duradero para tu mascota.",
    image: "/blue-leather-pet-collar-on-light-gray-background-p.jpg",
    price: 24.99,
    stock: 18,
  },
  {
    id: 6,
    title: "Correa Ajustable",
    category: "accesorios",
    description: "Correa resistente con longitud ajustable.",
    image: "/blue-leather-pet-collar-on-light-gray-background-p.jpg",
    price: 19.99,
    stock: 27,
  },
  {
    id: 7,
    title: "Snacks Naturales",
    category: "alimentos",
    description: "Premios saludables sin conservantes artificiales.",
    image: "/bowl-of-premium-pet-food-kibble-on-teal-background.jpg",
    price: 15.99,
    stock: 8,
  },
  {
    id: 8,
    title: "Arnés Deportivo",
    category: "accesorios",
    description: "Arnés cómodo para actividades al aire libre.",
    image: "/blue-leather-pet-collar-on-light-gray-background-p.jpg",
    price: 32.99,
    stock: 12,
  },
]

export default function Tienda() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("todos")

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "todos" || p.category === filter
    return matchesSearch && matchesFilter
  })

  const categories = [
    { id: "todos", label: "Todos los Productos" },
    { id: "alimentos", label: "Alimentos" },
    { id: "juguetes", label: "Juguetes" },
    { id: "accesorios", label: "Accesorios" },
  ]

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-gray-800">Tienda</h1>

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-64 shrink-0">
            <Card className="p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Categorías</h2>
              <nav className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      filter === cat.id
                        ? "bg-orange-500 text-white font-medium shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </nav>

              {/* Search in sidebar */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">Buscar</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar productos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </Card>
          </aside>

          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-500 text-lg">No se encontraron productos</p>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gradient-to-br from-orange-100 to-pink-100 p-6">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{product.title}</h3>

                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

                      {/* Stock and Price */}
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <p className="text-2xl font-bold text-orange-600">${product.price}</p>
                          <p className={`text-xs ${product.stock < 10 ? "text-red-500" : "text-green-600"}`}>
                            {product.stock < 10 ? `¡Solo ${product.stock} disponibles!` : `${product.stock} en stock`}
                          </p>
                        </div>

                        <Button size="sm" className="gap-2" disabled={product.stock === 0}>
                          <ShoppingCart className="h-4 w-4" />
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
