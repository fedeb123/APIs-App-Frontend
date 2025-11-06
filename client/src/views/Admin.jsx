import { useEffect, useState, useMemo } from "react"
import { Users, Tag, Package, ShoppingBag } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import useFetch from "../hooks/useFetch"
import useAuth from "../hooks/useAuth"
import { TabButton } from "../components/ui/admin/TabButton"
import { UserCard } from "../components/ui/admin/UserCard"
import { CategoryCard } from "../components/ui/admin/CategoryCard"
import { ProductCard } from "../components/ui/admin/ProductCard"
import { CategoryModal } from "../components/ui/admin/CategoryModal"
import { ProductModal } from "../components/ui/admin/ProductModal"
import { OrderCard } from "../components/ui/admin/OrderCard"

export default function Admin() {
  const [activeTab, setActiveTab] = useState("usuarios")
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [productosDesc, setProductosDesc] = useState([])
  const [categoriasDesc, setCategoriasDesc] = useState([])
  const [pedidos, setPedidos] = useState([])
  const { token } = useAuth()
  const [refresh, setRefresh] = useState(false)

  const [apiConfig, setApiConfig] = useState({ location: null, method: null })

  const { response: productsContent } = useFetch("productos", "GET", null, token, refresh)
  const { response: categoriesContent } = useFetch("categorias", "GET", null, token, refresh)
  const { response: productsDiscontContent } = useFetch("productos/descontinuados", "GET", null, token, refresh)
  const { response: categoriesDiscontContent } = useFetch("categorias/descontinuadas", "GET", null, token, refresh)
  const { response: pedidosContent } = useFetch("pedidos", "GET", null, token, refresh)
  const { response: usersContent } = useFetch("usuarios", "GET", null, token)

  const {
    response: apiResponse,
    loading: apiLoading,
    error: apiError,
  } = useFetch(apiConfig.location, apiConfig.method, apiConfig.payload, token)

  const [showCategoriaModal, setShowCategoriaModal] = useState(false)
  const [showProductoModal, setShowProductoModal] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState(null)
  const [editingProducto, setEditingProducto] = useState(null)
  const [categoriaForm, setCategoriaForm] = useState({ nombre: "", descripcion: "" })
  const [productoForm, setProductoForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoriaId: "",
  })

  const [pedidoSearch, setPedidoSearch] = useState("")
  const [pedidoEstado, setPedidoEstado] = useState("")

  const mapUsersById = useMemo(() => {
    if (!users) return
    return users.reduce((accumulator, user) => {
      if (user?.id != null) {
        accumulator[user.id] = user
        return accumulator
      }
    }, {})
  }, [users])

  const pedidosFiltrados = useMemo(() => {
    const termino = pedidoSearch.trim().toLowerCase()
    const estadoSel = pedidoEstado.trim()
    const lista = Array.isArray(pedidos) ? pedidos : []

    return lista.filter((pedido) => {
      if (estadoSel && pedido.estado !== estadoSel) return false
      if (!termino) return true
      const email = mapUsersById?.[pedido.clienteId]?.email?.toLowerCase() ?? ""
      return email.includes(termino)
    })
  }, [pedidos, pedidoSearch, pedidoEstado, mapUsersById])

  useEffect(() => {
    if (!apiLoading) {
      if (apiResponse) {
        const successMsg =
          (typeof apiResponse === "string" && apiResponse) || apiResponse?.message || "Operación realizada con éxito!"
        alert(successMsg)
        setRefresh((prev) => !prev)
        setShowCategoriaModal(false)
        setShowProductoModal(false)
      }
      if (apiError) {
        console.error("Error completo de la API:", apiError)
        const errorMsg =
          (typeof apiError.body === "string" && apiError.body) ||
          apiError.body?.message ||
          apiError.statusText ||
          `Error ${apiError.status}`
        alert(`Error al realizar la operación: ${errorMsg}`)
      }
    }
  }, [apiLoading])

  useEffect(() => {
    setProducts(productsContent?.content ?? [])
  }, [productsContent])
  useEffect(() => {
    setCategories(categoriesContent?.content ?? [])
  }, [categoriesContent])
  useEffect(() => {
    setProductosDesc(productsDiscontContent?.content ?? [])
  }, [productsDiscontContent])
  useEffect(() => {
    setCategoriasDesc(categoriesDiscontContent?.content ?? [])
  }, [categoriesDiscontContent])
  useEffect(() => {
    setPedidos(pedidosContent?.content ?? [])
  }, [pedidosContent])
  useEffect(() => {
    setUsers(usersContent?.content ?? [])
  }, [usersContent])

  const handleSaveCategoria = () => {
    const nombreActual = editingCategoria?.nombreCategoria ?? ""
    const descripcionActual = editingCategoria?.descripcion ?? ""
    const nombreNuevo = (categoriaForm.nombre ?? "").trim()
    const descripcionNueva = (categoriaForm.descripcion ?? "").trim()

    if (editingCategoria) {
      const payload = {}
      if (nombreNuevo && nombreNuevo !== nombreActual) {
        payload.nombreCategoria = nombreNuevo
      }
      if (descripcionNueva !== descripcionActual) {
        payload.descripcion = descripcionNueva
      }
      if (Object.keys(payload).length === 0) {
        alert("No hay cambios para guardar.")
        return
      }
      setApiConfig({ location: `categorias/${editingCategoria.id}`, method: "PUT", payload })
    } else {
      const payload = { nombreCategoria: nombreNuevo, descripcion: descripcionNueva }
      setApiConfig({ location: "categorias", method: "POST", payload })
    }
  }

  const handleEditCategoria = (categoria) => {
    setEditingCategoria(categoria)
    setCategoriaForm({ nombre: categoria.nombreCategoria, descripcion: categoria.descripcion })
    setShowCategoriaModal(true)
  }

  const handleDeleteCategoria = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta categoría?")) {
      setApiConfig({ location: `categorias/${id}`, method: "DELETE", payload: null })
    }
  }

  const handleSaveProducto = () => {
    const formData = new FormData()
    formData.append("nombre", productoForm.nombre)
    formData.append("descripcion", productoForm.descripcion)
    formData.append("precio", productoForm.precio ? Number(productoForm.precio) : 0)
    formData.append("stock", productoForm.stock ? Number(productoForm.stock) : 0)
    const categoriaId = productoForm.categoriaId ? Number(productoForm.categoriaId) : null
    formData.append("categoriaId", categoriaId)

    if (productoForm.imagenFile) {
      formData.append("imagen", productoForm.imagenFile)
    }

    setApiConfig({
      location: editingProducto ? `productos/${editingProducto.id}` : `productos`,
      method: editingProducto ? "PUT" : "POST",
      payload: formData,
    })

    setShowProductoModal(false)
    setProductoForm({ nombre: "", descripcion: "", precio: "", stock: "", categoriaId: "", imagenFile: null })
    setEditingProducto(null)
  }

  const handleEditProducto = (producto) => {
    if (!producto || !producto.id) {
      return alert("Producto inválido: no se puede editar.")
    }
    setEditingProducto(producto)
    setProductoForm({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio != null ? Number(producto.precio) : 0,
      stock: producto.stock != null ? Number(producto.stock) : 0,
      categoriaId: producto.categoriaId != null ? Number(producto.categoriaId) : "",
    })
    setShowProductoModal(true)
  }

  const handleDeleteProducto = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
      setApiConfig({ location: `productos/${id}`, method: "DELETE", payload: null })
    }
  }

  const handleReactivarCategoria = (id) => {
    if (window.confirm("¿Reactivar esta categoría?")) {
      setApiConfig({ location: `categorias/descontinuadas/reactivar/${id}`, method: "PUT", payload: {} })
    }
  }

  const handleReactivarProducto = (id) => {
    if (window.confirm("¿Reactivar este producto?")) {
      setApiConfig({ location: `productos/descontinuados/reactivar/${id}`, method: "PUT", payload: {} })
    }
  }

  const handleUpdateEstadoPedido = (id) => {
    setApiConfig({ location: `pedidos/${id}/enviar`, method: "PUT", payload: {} })
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Panel de Administración</h1>

        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <TabButton active={activeTab === "usuarios"} onClick={() => setActiveTab("usuarios")} icon={Users}>
            Usuarios
          </TabButton>
          <TabButton active={activeTab === "categories"} onClick={() => setActiveTab("categories")} icon={Tag}>
            Categorías
          </TabButton>
          <TabButton active={activeTab === "products"} onClick={() => setActiveTab("products")} icon={Package}>
            Productos
          </TabButton>
          <TabButton active={activeTab === "pedidos"} onClick={() => setActiveTab("pedidos")} icon={ShoppingBag}>
            Pedidos
          </TabButton>
          <TabButton
            active={activeTab === "categoriasDescontinuadas"}
            onClick={() => setActiveTab("categoriasDescontinuadas")}
            icon={ShoppingBag}
          >
            Categorias Descontinuadas
          </TabButton>
          <TabButton
            active={activeTab === "productosDescontinuados"}
            onClick={() => setActiveTab("productosDescontinuados")}
            icon={ShoppingBag}
          >
            Productos Descontinuados
          </TabButton>
        </div>

        {activeTab === "usuarios" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Listado de Usuarios</h2>
            <div className="grid gap-6">
              {users?.length ? (
                users.map((u) => <UserCard key={u.id} user={u} />)
              ) : (
                <p className="text-gray-600 text-center">No hay usuarios para mostrar.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Categorías Activas</h2>
              <Button
                onClick={() => {
                  setEditingCategoria(null)
                  setCategoriaForm({ nombre: "", descripcion: "" })
                  setShowCategoriaModal(true)
                }}
              >
                Nueva Categoría
              </Button>
            </div>
            <div className="grid gap-4">
              {categories.map((categoria) => (
                <CategoryCard
                  key={categoria.id}
                  categoria={categoria}
                  onEdit={handleEditCategoria}
                  onDelete={handleDeleteCategoria}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
              <Button
                onClick={() => {
                  setEditingProducto(null)
                  setProductoForm({ nombre: "", descripcion: "", precio: "", stock: "", categoriaId: "" })
                  setShowProductoModal(true)
                }}
              >
                Nuevo Producto
              </Button>
            </div>
            <div className="grid gap-4">
              {products.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  onEdit={handleEditProducto}
                  onDelete={handleDeleteProducto}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "productosDescontinuados" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Productos Descontinuados</h2>
            <div className="grid gap-4">
              {productosDesc.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  onReactivar={() => handleReactivarProducto(producto.id)}
                  showActions={false}
                  showReactivar={true}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "categoriasDescontinuadas" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Categorías Descontinuadas</h2>
            <div className="grid gap-4">
              {categoriasDesc.map((categoria) => (
                <CategoryCard
                  key={categoria.id}
                  categoria={categoria}
                  onReactivar={() => handleReactivarCategoria(categoria.id)}
                  showActions={false}
                  showReactivar={true}
                />
              ))}
              
            </div>
          </div>
        )}

        {activeTab === "pedidos" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Pedidos</h2>
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
              <div className="flex-1">
                <Input
                  value={pedidoSearch}
                  onChange={(e) => setPedidoSearch(e.target.value)}
                  placeholder="Buscar por email del usuario…"
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={pedidoEstado}
                  onChange={(e) => setPedidoEstado(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Todos los estados</option>
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="CONFIRMADO">CONFIRMADO</option>
                  <option value="ENVIADO">ENVIADO</option>
                </select>
                {(pedidoSearch || pedidoEstado) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPedidoSearch("")
                      setPedidoEstado("")
                    }}
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
            <div className="grid gap-4">
              {pedidosFiltrados.map((pedido) => (
                <OrderCard
                  key={pedido.id}
                  pedido={pedido}
                  userMap={mapUsersById}
                  onUpdateEstado={handleUpdateEstadoPedido}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <CategoryModal
        show={showCategoriaModal}
        editing={editingCategoria}
        form={categoriaForm}
        onChange={setCategoriaForm}
        onSave={handleSaveCategoria}
        onClose={() => {
          setShowCategoriaModal(false)
          setEditingCategoria(null)
        }}
      />

      <ProductModal
        show={showProductoModal}
        editing={editingProducto}
        form={productoForm}
        categories={categories}
        onChange={setProductoForm}
        onSave={handleSaveProducto}
        onClose={() => {
          setShowProductoModal(false)
          setEditingProducto(null)
        }}
      />
    </div>
  )
}
