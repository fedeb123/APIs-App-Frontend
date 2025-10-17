import { useState, useEffect } from "react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Pencil, Trash2, Plus, Package, Tag, ShoppingBag, X } from "lucide-react"
import useFetch from "../hooks/useFetch"

export default function Admin() {
  const [activeTab, setActiveTab] = useState("pedidos")

  // Estados para datos reales de la API
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [pedidos, setPedidos] = useState([])

  // Hooks para obtener datos del backend
  const token = localStorage.getItem('jwtToken')
  const { response: categoriasResponse, error: categoriasError } = useFetch('categorias', 'GET', null, token)
  const { response: productosResponse, error: productosError } = useFetch('productos', 'GET', null, token)
  const { response: pedidosResponse, error: pedidosError } = useFetch('pedidos', 'GET', null, token)

  // Cargar datos de la API en el estado del componente
  useEffect(() => {
    if (categoriasResponse) setCategorias(categoriasResponse.content || [])
    if (categoriasError) console.error("Error al obtener categorías:", categoriasError)
  }, [categoriasResponse, categoriasError])

  useEffect(() => {
    if (productosResponse) setProductos(productosResponse.content || [])
    if (productosError) console.error("Error al obtener productos:", productosError)
  }, [productosResponse, productosError])

  useEffect(() => {
    if (pedidosResponse) setPedidos(pedidosResponse.content || [])
    if (pedidosError) console.error("Error al obtener pedidos:", pedidosError)
  }, [pedidosResponse, pedidosError])


  // --- Lógica para los modales (aún por conectar a la API) ---
  const [showCategoriaModal, setShowCategoriaModal] = useState(false)
  const [showProductoModal, setShowProductoModal] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState(null)
  const [editingProducto, setEditingProducto] = useState(null)
  const [categoriaForm, setCategoriaForm] = useState({ nombre: "", descripcion: "" })
  const [productoForm, setProductoForm] = useState({ nombre: "", descripcion: "", precio: "", stock: "", categoria: "", imagen: "" })

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800"
      case "CONFIRMADO":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Panel de Administración</h1>

        {/* Tabs de Navegación */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button onClick={() => setActiveTab("pedidos")} className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === "pedidos" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600 hover:text-gray-900"}`}>
            <ShoppingBag className="w-5 h-5" />
            Pedidos
          </button>
          <button onClick={() => setActiveTab("productos")} className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === "productos" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600 hover:text-gray-900"}`}>
            <Package className="w-5 h-5" />
            Productos
          </button>
          <button onClick={() => setActiveTab("categorias")} className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === "categorias" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600 hover:text-gray-900"}`}>
            <Tag className="w-5 h-5" />
            Categorías
          </button>
        </div>

        {/* Pestaña de Pedidos */}
        {activeTab === "pedidos" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Pedidos</h2>
            <div className="grid gap-4">
              {pedidos.map((pedido) => (
                <Card key={pedido.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">Pedido #{pedido.id}</h3>
                      <p className="text-gray-600">#IdCliente: {pedido.clienteId}</p>
                      <p className="text-sm text-gray-500">Fecha: {new Date(pedido.fechaPedido).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">${pedido.precioTotal.toFixed(2)}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getEstadoColor(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Artículos:</h4>
                    {pedido.detalles && pedido.detalles.map((detalle) => (
                      <div key={detalle.id} className="flex justify-between text-sm text-gray-700 mb-1">
                        <span>{detalle.nombreProducto} x{detalle.cantidad}</span>
                        <span>${detalle.precioSubtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Pestaña de Productos (UI sin conectar a API de escritura) */}
        {activeTab === "productos" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
              <Button onClick={() => setShowProductoModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </div>
             <div className="grid gap-4">
              {productos.map((producto) => (
                <Card key={producto.id} className="p-6">
                  <div className="flex gap-6">
                    <img src={producto.imageUrl || "/placeholder.svg"} alt={producto.nombre} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{producto.nombre}</h3>
                      <p className="text-gray-600 mb-3">{producto.descripcion}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-700"><strong>Precio:</strong> ${producto.precio}</span>
                        <span className="text-gray-700"><strong>Stock:</strong> {producto.stock}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Pestaña de Categorías (UI sin conectar a API de escritura) */}
        {activeTab === "categorias" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h2>
              <Button onClick={() => setShowCategoriaModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Categoría
              </Button>
            </div>
            <div className="grid gap-4">
              {categorias.map((categoria) => (
                <Card key={categoria.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{categoria.nombreCategoria}</h3>
                      <p className="text-gray-600">{categoria.descripcion}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
