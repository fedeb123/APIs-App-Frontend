import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "../components/ui/Input"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Search, ShoppingCart, X } from "lucide-react"
import useFetch from "../hooks/useFetch"
import useUser from "../hooks/useUser"

const imagesUrl  = import.meta.env.VITE_APP_API_IMAGES_URL

export default function Tienda() {
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productosComprados, setProductosComprados] = useState([])
  const [filter, setFilter] = useState("todos")
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [user, setUser] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [payload, setPayload] = useState(null)

  const [token, setToken] = useState(localStorage.getItem('jwtToken'))
  const { user: responseUser, loading } = useUser(token)

  const navigate = useNavigate()

  const { response: productsContent, loading: loadingProducts, error: errorProducts } = useFetch('productos', 'GET')
  const { response: categoriesContent, loading: loadingCategories, error: errorCategories } = useFetch('categorias', 'GET')
  const { response: responsePost, loading: loadingPost, error: errorPost } = useFetch('pedidos', 'POST', payload, token)

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
    if (errorPost) {
      console.error(JSON.stringify(errorPost))
    }
  }, [errorPost])

  useEffect(() => {
    setProducts(productsContent?.content ?? [])
  }, [productsContent])

  useEffect(() => {
    setCategories(categoriesContent?.content ?? [])
  }, [categoriesContent])


  useEffect(() => {
    if (responseUser && !loading) {
      setUser(responseUser)
    }
  }, [responseUser, loading])

  useEffect(() => {
    if (errorProducts) {
      console.error(JSON.stringify(errorProducts))
    }

    if (errorCategories) {
      console.error(JSON.stringify(errorCategories))
    }

  }, [errorProducts, errorCategories])

  const handleAgregarProducto = (product) => {
    if (!user || !token) {
      alert("Tienes que estar logueado para comprar, obviamente")
      navigate('/login')
      return
    }
    setSelectedProduct(product)
    setShowModal(true)
    setQuantity(1)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedProduct(null)
    setQuantity(1)
  }

  //handleComprar seria luego handleAgregarAlCarrito
  const handleComprar = (product) => {
    if (!user || !token) {
      alert("Tienes que estar logueado para comprar")
      navigate('/login')
      return
    }
    setProductosComprados([...productosComprados, { ...product, cantidad: quantity }])

    const data = {
      clienteId: user.id,
      detalles: [
        {
          productoId: product.id,
          cantidad: quantity,
        },
      ],
    }

    setPayload(data)
  }

  useEffect(() => {
    if (!loadingPost && responsePost) {
      alert('Gracias por Tu Compra!')
      navigate('/pedidos')
    }
  }, [responsePost, loadingPost])

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
                          <Button onClick={() => handleAgregarProducto(product)} size="sm" className="gap-2" disabled={product.stock === 0}>
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
      {showModal && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md hover:bg-gray-100 hover:text-gray-900 transition"
              onClick={closeModal}
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Imagen */}
              <div className="bg-gradient-to-br from-orange-50 via-rose-50 to-pink-100 p-8 flex items-center justify-center">
                <div className="relative aspect-square w-full max-w-sm rounded-2xl bg-white/70 shadow-inner ring-1 ring-gray-200 flex items-center justify-center">
                  <img
                    src={selectedProduct.imageUrl ? imagesUrl + selectedProduct.imageUrl : '/placeholder.svg'}
                    alt={selectedProduct.nombre}
                    className="max-h-[320px] object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                      {selectedProduct.nombre}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                        selectedProduct.stock < 10
                          ? 'bg-red-50 text-red-700 ring-red-200'
                          : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                      }`}
                    >
                      {selectedProduct.stock < 10
                        ? `Quedan ${selectedProduct.stock}`
                        : 'En stock'}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {selectedProduct.descripcion}
                  </p>

                  <div className="space-y-1">
                    <span className="block text-xs uppercase tracking-wide text-gray-500">
                      Precio
                    </span>
                    <span className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                      ${selectedProduct.precio}
                    </span>
                  </div>
                  {/* Cantidad */}
                  <div className="mt-6">
                    <label htmlFor="cantidad" className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
                      Cantidad
                    </label>
                    <select
                      id="cantidad"
                      aria-label="Cantidad"
                      className="w-full md:w-40 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-60"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      disabled={selectedProduct.stock === 0}
                    >
                      {Array.from({ length: Math.max(0, Math.min(selectedProduct.stock ?? 0, 10)) }, (_, i) => i + 1).map((q) => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl"
                    onClick={closeModal}
                  >
                    Cerrar
                  </Button>
                  <Button onClick={() => handleComprar(selectedProduct)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-pink-600 transition disabled:opacity-60 disabled:shadow-none"
                    disabled={selectedProduct.stock === 0}
                  >
                    Comprar Ahora!
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
