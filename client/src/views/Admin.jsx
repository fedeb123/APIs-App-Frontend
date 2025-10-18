import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Pencil, Trash2, Plus, Package, Tag, ShoppingBag, X } from "lucide-react";
import useFetch from "../hooks/useFetch";

const imagesUrl = import.meta.env.VITE_APP_API_IMAGES_URL;

export default function Admin() {
  // --- ESTADOS Y HOOKS ---
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [token] = useState(localStorage.getItem('jwtToken'));
  const [refresh, setRefresh] = useState(false);

  // Estados para manejar las llamadas a la API (Crear, Actualizar, Borrar)
  const [apiConfig, setApiConfig] = useState({ location: null, method: null, payload: null });

  // Hooks para OBTENER datos (se refrescan cuando 'refresh' cambia)
  const { response: productsContent } = useFetch('productos', 'GET', null, token, refresh);
  const { response: categoriesContent } = useFetch('categorias', 'GET', null, token, refresh);
  const { response: pedidosContent } = useFetch('pedidos', 'GET', null, token, refresh);

  // Hook para ENVIAR datos (POST, PUT, DELETE)
  const { response: apiResponse, error: apiError } = useFetch(apiConfig.location, apiConfig.method, apiConfig.payload, token);

  // Estados para los modales y formularios
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [editingProducto, setEditingProducto] = useState(null);
  const [categoriaForm, setCategoriaForm] = useState({ nombre: "", descripcion: "" });
  const [productoForm, setProductoForm] = useState({ nombre: "", descripcion: "", precio: "", stock: "", categoriaId: "" });

  // --- EFECTOS PARA MANEJAR DATOS Y RESPUESTAS DE API ---

  // Efecto para manejar la respuesta de las operaciones CUD
  useEffect(() => {
    if (apiResponse) {
      alert("Operación realizada con éxito!");
      setRefresh(prev => !prev); // Forza la recarga de datos
      setShowCategoriaModal(false);
      setShowProductoModal(false);
      setApiConfig({ location: null, method: null, payload: null });
    }
    if (apiError) {
      console.error("Error completo de la API:", apiError);
      const errorMessage = apiError.body?.message || `Error ${apiError.status} sin mensaje claro del servidor.`;
      alert(`Error al realizar la operación: ${errorMessage}`);
      setApiConfig({ location: null, method: null, payload: null });
    }
  }, [apiResponse, apiError]);

  // Efectos para actualizar el estado cuando los datos se cargan
  useEffect(() => { setProducts(productsContent?.content ?? []) }, [productsContent]);
  useEffect(() => { setCategories(categoriesContent?.content ?? []) }, [categoriesContent]);
  useEffect(() => { setPedidos(pedidosContent?.content ?? []) }, [pedidosContent]);

  // --- FUNCIONES CRUD PARA CATEGORÍAS ---
  const handleSaveCategoria = () => {
    const payload = { nombreCategoria: categoriaForm.nombre, descripcion: categoriaForm.descripcion };
    if (editingCategoria) {
      setApiConfig({ location: `categorias/${editingCategoria.id}`, method: 'PUT', payload });
    } else {
      setApiConfig({ location: 'categorias', method: 'POST', payload });
    }
  };

  const handleEditCategoria = (categoria) => {
    setEditingCategoria(categoria);
    setCategoriaForm({ nombre: categoria.nombreCategoria, descripcion: categoria.descripcion });
    setShowCategoriaModal(true);
  };

  const handleDeleteCategoria = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta categoría?")) {
      setApiConfig({ location: `categorias/${id}`, method: 'DELETE', payload: null });
    }
  };

  // --- FUNCIONES CRUD PARA PRODUCTOS ---
  const handleSaveProducto = () => {
    const payload = {
      nombre: productoForm.nombre,
      descripcion: productoForm.descripcion,
      precio: parseFloat(productoForm.precio),
      stock: parseInt(productoForm.stock, 10),
      categoriaId: parseInt(productoForm.categoriaId, 10)
    };
    if (editingProducto) {
      setApiConfig({ location: `productos/${editingProducto.id}`, method: 'PUT', payload });
    } else {
      setApiConfig({ location: 'productos', method: 'POST', payload });
    }
  };

  const handleEditProducto = (producto) => {
    setEditingProducto(producto);
    setProductoForm({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        categoriaId: producto.categoriaId
    });
    setShowProductoModal(true);
  };

  const handleDeleteProducto = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
      setApiConfig({ location: `productos/${id}`, method: 'DELETE', payload: null });
    }
  };

  // --- FUNCIONES PARA PEDIDOS ---
  const handleUpdateEstadoPedido = (id, nuevoEstado) => {
    setApiConfig({ location: `pedidos/estado/${id}`, method: 'PUT', payload: { estado: nuevoEstado } });
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "PENDIENTE": return "bg-yellow-100 text-yellow-800";
      case "CONFIRMADO": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // --- INICIO DEL CÓDIGO JSX QUE SE RENDERIZA ---
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Panel de Administración</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button onClick={() => setActiveTab("categories")} className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === "categories" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600 hover:text-gray-900"}`}>
            <Tag className="w-5 h-5" /> Categorías
          </button>
          <button onClick={() => setActiveTab("products")} className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === "products" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600 hover:text-gray-900"}`}>
            <Package className="w-5 h-5" /> Productos
          </button>
          <button onClick={() => setActiveTab("pedidos")} className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === "pedidos" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600 hover:text-gray-900"}`}>
            <ShoppingBag className="w-5 h-5" /> Pedidos
          </button>
        </div>

        {/* Categories Tab Content */}
        {activeTab === "categories" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h2>
              <Button onClick={() => { setEditingCategoria(null); setCategoriaForm({ nombre: "", descripcion: "" }); setShowCategoriaModal(true); }}>
                <Plus className="w-4 h-4 mr-2" /> Nueva Categoría
              </Button>
            </div>
            <div className="grid gap-4">
              {categories.map((categoria) => (
                <Card key={categoria.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{categoria.nombreCategoria}</h3>
                      <p className="text-gray-600">{categoria.descripcion}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditCategoria(categoria)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteCategoria(categoria.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Products Tab Content */}
        {activeTab === "products" && (
            <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
                <Button onClick={() => { setEditingProducto(null); setProductoForm({ nombre: "", descripcion: "", precio: "", stock: "", categoriaId: "" }); setShowProductoModal(true);}}>
                <Plus className="w-4 h-4 mr-2" /> Nuevo Producto
                </Button>
            </div>
            <div className="grid gap-4">
                {products.map((producto) => (
                <Card key={producto.id} className="p-6">
                    <div className="flex gap-6">
                    <img src={producto.imageUrl ? imagesUrl + producto.imageUrl : '/placeholder.svg'} alt={producto.nombre} className="w-24 h-24 object-cover rounded-lg"/>
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{producto.nombre}</h3>
                        <p className="text-gray-600 mb-3">{producto.descripcion}</p>
                        <div className="flex gap-4 text-sm">
                        <span className="text-gray-700"><strong>Precio:</strong> ${producto.precio}</span>
                        <span className="text-gray-700"><strong>Stock:</strong> {producto.stock}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditProducto(producto)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteProducto(producto.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                    </div>
                </Card>
                ))}
            </div>
            </div>
        )}

        {/* Orders Tab Content */}
        {activeTab === "pedidos" && (
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Pedidos</h2>
                <div className="grid gap-4">
                {pedidos.map((pedido) => (
                    <Card key={pedido.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">Pedido #{pedido.id}</h3>
                        <p className="text-gray-600">Cliente: {pedido.clienteNombre}</p>
                        <p className="text-sm text-gray-500">Fecha: {new Date(pedido.fechaPedido).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                        <p className="text-2xl font-bold text-orange-600">${pedido.precioTotal.toFixed(2)}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getEstadoColor(pedido.estado)}`}>{pedido.estado}</span>
                        </div>
                    </div>
                    <div className="border-t pt-4 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Artículos:</h4>
                        {pedido.detalles.map((detalle) => (
                        <div key={detalle.id} className="flex justify-between text-sm text-gray-700 mb-1">
                            <span>{detalle.nombreProducto} x{detalle.cantidad}</span>
                            <span>${detalle.precioSubtotal.toFixed(2)}</span>
                        </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleUpdateEstadoPedido(pedido.id, "PENDIENTE")} disabled={pedido.estado === "PENDIENTE"}>Marcar Pendiente</Button>
                        <Button variant="outline" size="sm" onClick={() => handleUpdateEstadoPedido(pedido.id, "CONFIRMADO")} disabled={pedido.estado === "CONFIRMADO"}>Marcar Confirmado</Button>
                    </div>
                    </Card>
                ))}
                </div>
            </div>
        )}
      </div>

      {/* Category Modal */}
      {showCategoriaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
          <Card className="w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setShowCategoriaModal(false); setEditingCategoria(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{editingCategoria ? "Editar Categoría" : "Nueva Categoría"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <Input value={categoriaForm.nombre} onChange={(e) => setCategoriaForm({ ...categoriaForm, nombre: e.target.value })} placeholder="Nombre de la categoría"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <Input value={categoriaForm.descripcion} onChange={(e) => setCategoriaForm({ ...categoriaForm, descripcion: e.target.value })} placeholder="Descripción de la categoría"/>
              </div>
              <Button onClick={handleSaveCategoria} className="w-full">{editingCategoria ? "Actualizar" : "Crear"} Categoría</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Product Modal */}
      {showProductoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
          <Card className="w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setShowProductoModal(false); setEditingProducto(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{editingProducto ? "Editar Producto" : "Nuevo Producto"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <Input value={productoForm.nombre} onChange={(e) => setProductoForm({ ...productoForm, nombre: e.target.value })} placeholder="Nombre del producto"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <Input value={productoForm.descripcion} onChange={(e) => setProductoForm({ ...productoForm, descripcion: e.target.value })} placeholder="Descripción del producto"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                <Input type="number" step="0.01" value={productoForm.precio} onChange={(e) => setProductoForm({ ...productoForm, precio: e.target.value })} placeholder="0.00"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                <Input type="number" value={productoForm.stock} onChange={(e) => setProductoForm({ ...productoForm, stock: e.target.value })} placeholder="0"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select value={productoForm.categoriaId} onChange={(e) => setProductoForm({ ...productoForm, categoriaId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombreCategoria}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleSaveProducto} className="w-full">{editingProducto ? "Actualizar" : "Crear"} Producto</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}