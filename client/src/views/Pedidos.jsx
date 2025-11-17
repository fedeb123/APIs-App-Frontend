import { useState, useEffect, useMemo } from "react"
import { Clock, ShoppingCart } from 'lucide-react'
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { useCart } from "../context/CartContext"
import { ConfirmationModal } from "../components/ui/pedidos/ConfirmationModal"
import { OrderCard } from "../components/ui/pedidos/OrderCard"

import { fetchPedidosUsuario, confirmPedido } from "../features/pedidosSlice"
import { fetchProductos } from "../features/productosSlice"

export default function Pedidos() {
  const { token, user } = useAuth()
  const { cart, clearCart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [refresh, setRefresh] = useState(false)
  const [pedidos, setPedidos] = useState([])
  const [productos, setProductos] = useState([])
  const [cartPayload, setCartPayload] = useState(null)

  const dispatch = useDispatch()

  const { response: responsePedidos, loading: loadingPedidos } = useFetch("pedidos/usuario", "GET", null, token, refresh)

  const [pedidoAConfirmar, setPedidoAConfirmar] = useState(null)

  const { response: responseProductos, loading: loadingProductos, error: errorProductos } = useFetch("productos", "GET", null, null)
  const { response: responseCartOrder, loading: loadingCartOrder, error: errorCartOrder } = useFetch("pedidos", "POST", cartPayload, token)


  const {
    items: pedidos,
    loading: loadingPedidos,
    error: errorPedidos,
    confirming,
    confirmError,
  } = useSelector((state) => state.pedidos)

  const {
    productos,
    loading: loadingProductos,
    error: errorProductos,
  } = useSelector((state) => state.productos)

  useEffect(() => {
    dispatch(fetchPedidosUsuario())
  }, [dispatch])

  useEffect(() => {
    if (errorProductos) {
      console.error("Error productos:", errorProductos)
      alert("Error al correlacionar stock de productos: " + JSON.stringify(errorProductos))
    }
  }, [errorProductos])

  useEffect(() => {
    if (errorPedidos) {
      console.error("Error pedidos:", errorPedidos)
      alert("Error al cargar pedidos: " + JSON.stringify(errorPedidos))
    }
  }, [errorPedidos])

  useEffect(() => {
    if (confirmError) {
      alert(`Error al confirmar el pedido: ${confirmError.message || "Error de servidor"}`)
    }
  }, [confirmError])

  const handleConfirmClick = (pedido) => setPedidoAConfirmar(pedido)
  const handleCloseModal = () => setPedidoAConfirmar(null)

  const mapStockAndStateProductsById = useMemo(() => {
    if (!Array.isArray(productos) || productos.length === 0) return {}

    return productos.reduce((acc, producto) => {
      if (producto?.id != null) {
        acc[producto.id] = {
          stock: producto.stock,
          activo: producto.activo,
        }
      }
      return acc
    }, {})
  }, [productos])

  const handleConfirmSubmit = (pedidoId, codigo, metodoPago, detalles) => {
    let exepcionFaltante = false
    let exepcionDescontinuado = false

    if (!productos || productos.length === 0 || Object.keys(mapStockAndStateProductsById).length === 0) {
      alert("Todavía estamos cargando el stock de productos. Intentá de nuevo en unos segundos.")
      return
    }

    detalles.forEach((item) => {
      const prod = mapStockAndStateProductsById?.[item.productoId]

      if (!prod) {
        alert(`Momentaneamente no comercializamos el producto: ${item.nombreProducto}. Intente más tarde.`)
        exepcionDescontinuado = true
        return
      }

      const stockRestante = (prod?.stock ?? 0) - (item?.cantidad ?? 0)

      if (stockRestante < 0) {
        alert(
          `Momentaneamente no contamos con stock de: ${item.cantidad} para el producto: ${item.nombreProducto}. Intente más tarde.`,
        )
        exepcionFaltante = true
      }
    })

    if (exepcionFaltante || exepcionDescontinuado) {
      handleCloseModal()
      return
    }

    dispatch(
      confirmPedido({
        pedidoId,
        codigoDescuento: codigo,
        metodoDePago: metodoPago,
      }),
    )
    .unwrap()
    .then(() => {
      alert("¡Pedido confirmado y facturado con éxito!")
      handleCloseModal()
      dispatch(fetchPedidosUsuario())
    })
    .catch((err) => {
      alert(`Error al confirmar el pedido: ${err.message || "Error de servidor"}`)
    })
  }
useEffect(() => {
    const cartFromState = location.state?.cart
    
    if (cartFromState && cartFromState.length > 0 && user) {
      const data = {
        clienteId: user.id,
        detalles: cartFromState.map(item => ({
          productoId: item.id,
          cantidad: item.cantidad,
        })),
      }
      setCartPayload(data)
    }
  }, [location.state, user])

  useEffect(() => {
    if (!loadingCartOrder && responseCartOrder) {
      alert("Pedido creado! Ahora confírmalo para finalizarlo.")
      clearCart()
      setCartPayload(null)
      setRefresh((prev) => !prev)
      navigate("/pedidos", { replace: true, state: {} })
    }
    if (errorCartOrder) {
      alert(`Error al crear el pedido: ${errorCartOrder.body?.message || "Error de servidor"}`)
      setCartPayload(null)
    }
  }, [responseCartOrder, loadingCartOrder, errorCartOrder, clearCart, navigate])

  const pedidosPendientes = useMemo(
    () => pedidos.filter((p) => p.estado === "PENDIENTE"),
    [pedidos],
  )

  const pedidosConfirmados = useMemo(
    () => pedidos.filter((p) => p.estado !== "PENDIENTE"),
    [pedidos],
  )

  if (loadingPedidos || loadingCartOrder) return <div className="text-center py-10">Cargando pedidos...</div>

  return (
    <div className="container mx-auto py-10">
      {pedidoAConfirmar && (
        <ConfirmationModal
          pedido={pedidoAConfirmar}
          onClose={handleCloseModal}
          onConfirm={handleConfirmSubmit}
          loading={confirming}
        />
      )}

      <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <Clock /> Pedidos Pendientes
        </h2>
        {pedidosPendientes.length === 0 ? (
          <p className="text-gray-500">No tienes pedidos pendientes de confirmación.</p>
        ) : (
          <div className="grid gap-4">
            {pedidosPendientes.map((pedido) => (
              <OrderCard key={pedido.id} pedido={pedido} onConfirm={handleConfirmClick} isPending={true} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <ShoppingCart /> Historial de Compras
        </h2>
        {pedidosConfirmados.length === 0 ? (
          <p className="text-gray-500">Aún no tienes compras confirmadas.</p>
        ) : (
          <div className="grid gap-4">
            {pedidosConfirmados.map((pedido) => (
              <OrderCard key={pedido.id} pedido={pedido} isPending={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
