
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "../components/ui/Card"
import { ProductCard } from "../components/ui/tienda/ProductCard"
import { CategorySidebar } from "../components/ui/tienda/CategorySidebar"
import { ProductModal } from "../components/ui/tienda/ProductModal"
import { useDispatch, useSelector } from 'react-redux'
import { createProducto, fetchProductosStockeados } from "../features/productosSlice"
import { fetchCategorias } from "../features/categoriasSlice"
import { createPedido } from "../features/pedidosSlice"
import { addToCart, removeFromCart, clearCart, updateQuantity } from "../features/cartSlice"

export default function Tienda() {
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [filter, setFilter] = useState("todos")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [user, setUser] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const { user: responseUser, loadingProfile, token } = useSelector((state) => state.auth)
  const { cart, precioTotal, cantidad } = useSelector((state) => state.cart)

  const navigate = useNavigate()
  const dispatch = useDispatch()


  const { productos: products, loading: loadingProducts, error: errorProducts } = useSelector((state) => state.productos)
  const { categorias: categoriesContent, loading: loadingCategories, error: errorCategories } = useSelector((state)=> state.categorias)
  const { creating: creatingPedido, createError } = useSelector((state)=>state.pedidos)
  
  useEffect(() => {
    if (products && categoriesContent) {
      //console.log(products)
      setFilteredProducts(
        products.filter((p) => {
          const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase())
          const matchesFilter = filter === "todos" || p.categoriaId === filter
          return matchesSearch && matchesFilter
        }),
      )
    }
  }, [categoriesContent, products, search, filter])

  useEffect(() => {
    dispatch(fetchProductosStockeados())
  }, [dispatch])


  useEffect(()=>{
    dispatch(fetchCategorias())
  },[dispatch])
  
  useEffect(() => {
    if (responseUser && !loadingProfile) {
      setUser(responseUser)
    }
  }, [responseUser, loadingProfile])

  useEffect(() => {
    if (errorCategories) {
      console.error(JSON.stringify(errorCategories))
    }
  }, [errorCategories])

  const handleAgregarProducto = (product) => {
    if (!user || !token) {
      alert("Tienes que estar logueado para comprar")
      navigate("/login")
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

  const handleComprar = () => {
    if (!user) {
      alert("Tienes que estar logueado para comprar")
      navigate("/login")
      return
    }

    if (!user.direccion) {
      alert("Carga tu direccion antes de comprar")
      navigate("/perfil")
      return
    }

    dispatch(addToCart({selectedProduct, quantity}))
    closeModal()
    alert(`${selectedProduct.nombre} agregado al carrito`)
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-gray-800">Tienda</h1>

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-64 shrink-0">
            <CategorySidebar
              categories={categoriesContent}
              filter={filter}
              onFilterChange={setFilter}
              search={search}
              onSearchChange={setSearch}
              loading={loadingCategories}
              error={errorCategories}
            />
          </aside>

          <main className="flex-1">
            {(loadingCategories || loadingProducts) && (
              <Card className="p-12 text-center">
                <p className="text-gray-500 text-lg">Cargando productos..</p>
              </Card>
            )}

            {errorProducts && (
              <Card className="p-12 text-center">
                <p className="text-gray-500 text-lg">Error obteniendo productos: {`${errorProducts}`}</p>
              </Card>
            )}

            {!loadingCategories &&
              !loadingProducts &&
              !errorCategories &&
              !errorProducts &&
              (filteredProducts.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-gray-500 text-lg">No se encontraron productos</p>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAgregarProducto} />
                  ))}
                </div>
              ))}
          </main>
        </div>
      </div>

      {showModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onClose={closeModal}
          onConfirm={handleComprar}
        />
      )}
    </div>
  )
}
