import { Search } from "lucide-react"
import { Card } from "../Card"
import { Input } from "../Input"

export function CategorySidebar({ categories, filter, onFilterChange, search, onSearchChange, loading, error }) {
  if (loading) {
    return <Card className="p-6 sticky top-4">Cargando Categorias...</Card>
  }

  if (error) {
    return <Card className="p-6 sticky top-4">Error obteniendo categorias: {`${error}`}</Card>
  }

  return (
    <Card className="p-6 sticky top-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Categorías</h2>
      <nav className="space-y-2">
        <button
          className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
            filter === "todos"
              ? "bg-orange-500 text-white font-medium shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => onFilterChange("todos")}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onFilterChange(cat.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
              filter === cat.id
                ? "bg-orange-500 text-white font-medium shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.nombreCategoria}
          </button>
        ))}
      </nav>

      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Buscar</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </Card>
  )
}
