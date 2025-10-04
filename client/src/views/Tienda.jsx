import { useState } from "react"
import { ProductoSeccion } from "../components/ProductoSeccion"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"

// productos simulados
const products = [
  {
    id: "food",
    title: "Food",
    category: "alimentos",
    description: "Nutritious and delicious food for your furry friend.",
    image: "/bowl-of-premium-pet-food-kibble-on-teal-background.jpg",
    bgColor: "bg-[oklch(0.55_0.12_195)]",
  },
  {
    id: "toys",
    title: "Toys",
    category: "juguetes",
    description: "Fun and engaging toys for hours of playtime.",
    image: "/colorful-pet-toys-rope-balls-on-light-blue-backgro.jpg",
    bgColor: "bg-[oklch(0.75_0.08_210)]",
  },
  {
    id: "accessories",
    title: "Accessories",
    category: "accesorios",
    description: "Stylish and comfortable accessories for every occasion.",
    image: "/blue-leather-pet-collar-on-light-gray-background-p.jpg",
    bgColor: "bg-[oklch(0.90_0.01_85)]",
  },
]

export default function Tienda() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("todos")

  // filtrado dinámico
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "todos" || p.category === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-8">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">Tienda</h1>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:gap-6">
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />

        <div className="flex gap-2">
          <Button
            variant={filter === "todos" ? "default" : "outline"}
            onClick={() => setFilter("todos")}
          >
            Todos
          </Button>
          <Button
            variant={filter === "alimentos" ? "default" : "outline"}
            onClick={() => setFilter("alimentos")}
          >
            Alimentos
          </Button>
          <Button
            variant={filter === "juguetes" ? "default" : "outline"}
            onClick={() => setFilter("juguetes")}
          >
            Juguetes
          </Button>
          <Button
            variant={filter === "accesorios" ? "default" : "outline"}
            onClick={() => setFilter("accesorios")}
          >
            Accesorios
          </Button>
        </div>
      </div>

      {/* Renderizado con productos filtrados */}
      <ProductoSeccion products={filteredProducts} />
    </div>
  )
}

