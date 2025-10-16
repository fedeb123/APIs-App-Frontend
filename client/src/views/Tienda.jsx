import { useEffect, useState } from "react"
import { Input } from "../components/ui/Input"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Search, ShoppingCart } from "lucide-react"
import useFetch from "../hooks/useFetch"

const imagesUrl  = import.meta.env.VITE_APP_API_IMAGES_URL

export default function Tienda() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("todos")
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])

  const { response: productsContent, loading: loadingProducts, error: errorProducts } = useFetch('productos', 'GET')
  const { response: categoriesContent, loading: loadingCategories, error: errorCategories } = useFetch('categorias', 'GET')

  //TESTERS
  // const loadingProducts = false
  // const loadingCategories = false
  // const categoriesContent = undefined
  // const productsContent = undefined
  // const errorProducts = false
  // const errorCategories = false

  useEffect(() => {
    if(products && categories) {
      setFilteredProducts(
        products.filter((p) => {
          const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase())
          const matchesFilter = filter === "todos" || p.categoriaId === filter
          return matchesSearch && matchesFilter
        })
      )
    }
  }, [categories, products, search, filter])

  useEffect(() => {
    setProducts(productsContent?.content ?? [])
  }, [productsContent])

  useEffect(() => {
    setCategories(categoriesContent?.content ?? [])
  }, [categoriesContent])

  useEffect(() => {
    if (errorProducts) {
      console.error(JSON.stringify(errorProducts))
    }

    if (errorCategories) {
      console.error(JSON.stringify(errorCategories))
    }

  }, [errorProducts, errorCategories])

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-gray-800">Tienda</h1>

          <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-64 shrink-0">

            {loadingCategories && (
              <Card className="p-6 sticky top-4">
                Cargando Categorias...
              </Card>
            )}

            {(errorCategories) && (
              <Card className="p-6 sticky top-4">
                Error obteniendo categorias: {`${errorCategories}`}
              </Card>
            )}

            {(!loadingCategories && !errorCategories) && (
            <Card className="p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Categorías</h2>
              <nav className="space-y-2">
                <button className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      filter === "todos"
                        ? "bg-orange-500 text-white font-medium shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`} onClick={() => setFilter("todos")}
                >
                  Todos
                </button>
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
                    {cat.nombreCategoria}
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
            )}
          </aside>

          <main className="flex-1">
            
            {(loadingCategories || loadingProducts)&& (
              <Card className="p-12 text-center">
                <p className="text-gray-500 text-lg">Cargando productos..</p>
              </Card>
            )}

            {(errorProducts)&& (
              <Card className="p-12 text-center">
                <p className="text-gray-500 text-lg">Error obteniendo productos: {`${errorProducts}`}</p>
              </Card>
            )}

            {(!loadingCategories && !loadingProducts && !errorCategories && !errorProducts) && (
              filteredProducts.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-gray-500 text-lg">No se encontraron productos</p>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="w-56 overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                    >
                      <div className="aspect-square bg-gradient-to-br from-orange-100 to-pink-100 p-6">
                        <img
                          src={product.imageUrl ? imagesUrl + product.imageUrl : '/placeholder.svg'}
                          alt={product.nombre}
                          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 space-y-3">
                        <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{product.nombre}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{product.descripcion}</p>
                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <p className="text-2xl font-bold text-orange-600">${product.precio}</p>
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
              )
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
