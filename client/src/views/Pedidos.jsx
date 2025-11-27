import { useState, useEffect, useMemo } from "react"
import { Clock, ShoppingCart } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { ConfirmationModal } from "../components/ui/pedidos/ConfirmationModal"
import { OrderCard } from "../components/ui/pedidos/OrderCard"

import { createPedido } from "../features/pedidosSlice"
import { fetchPedidosUsuario, confirmPedido } from "../features/pedidosSlice"
import { clearCart } from "../features/cartSlice"

import { toast } from "react-toastify"

export default function Pedidos() {
  const { user } = useSelector((state) => state.auth)
  const { cart } = useSelector((state) => state.cart)

  const { items: pedidos, loading: loadingPedidos, error: errorPedidos, confirming, confirmError, creating, createError } = useSelector((state) => state.pedidos)

  const { productos, loading: loadingProductos, error: errorProductos } = useSelector((state) => state.productos)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [pedidoAConfirmar, setPedidoAConfirmar] = useState(null)

  useEffect(() => {
    dispatch(fetchPedidosUsuario())
  }, [dispatch])

  useEffect(() => {
    if (errorProductos) {
      console.error("Error productos:", errorProductos)
      toast.error("Error al correlacionar stock de productos: " + JSON.stringify(errorProductos))
    }
  }, [errorProductos])

  useEffect(() => {
    if (errorPedidos) {
      toast.error("Error al cargar pedidos: " + JSON.stringify(errorPedidos))
    }
  }, [errorPedidos])

  useEffect(() => {
    if (confirmError) {
      toast.error(`Error al confirmar el pedido: ${confirmError.message || "Error de servidor"}`)
    }
  }, [confirmError])

  useEffect(() => {
    if (createError) {
      toast.error(`Error al crear el pedido: ${createError.message || "Error de servidor"}`)
    }
  }, [createError])

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
      toast.loading("Todavía estamos cargando el stock de productos. Intentá de nuevo en unos segundos.")
      return
    }

    detalles.forEach((item) => {
      const prod = mapStockAndStateProductsById?.[item.productoId]

      if (!prod) {
        toast.error(`Momentaneamente no comercializamos el producto: ${item.nombreProducto}. Intente más tarde.`)
        exepcionDescontinuado = true
        return
      }

      const stockRestante = (prod?.stock ?? 0) - (item?.cantidad ?? 0)

      if (stockRestante < 0) {
        toast.error(`Momentaneamente no contamos con stock de: ${item.cantidad} para el producto: ${item.nombreProducto}. Intente más tarde.`)
        exepcionFaltante = true
      }
    })

    if (exepcionFaltante || exepcionDescontinuado) {
      handleCloseModal()
      return
    }

    dispatch(confirmPedido({pedidoId, codigoDescuento: codigo, metodoDePago: metodoPago }))
    toast.success("¡Pedido confirmado y facturado con éxito!")
    handleCloseModal()
    navigate("/pedidos", { replace: true })
  }

  const handleCreatePedido = () => {
    if (!user) {
      toast.error("Tenés que estar logueado para crear un pedido")
      navigate("/login")
      return
    }
    if (!cart || cart.length === 0) {
      toast.error("El carrito está vacío")
      return
    }

    const payload = {
      clienteId: user.id,
      detalles: cart.map((it) => ({ productoId: it.id, cantidad: it.cantidad })),
    }

    dispatch(createPedido(payload))
    toast.success("Pedido creado! Ahora confírmalo para finalizarlo.")

    dispatch(clearCart())
    navigate("/pedidos", { replace: true })    
  }

  const pedidosPendientes = useMemo(
    () => pedidos.filter((p) => p.estado === "PENDIENTE"),
    [pedidos],
  )

  const pedidosConfirmados = useMemo(
    () => pedidos.filter((p) => p.estado !== "PENDIENTE"),
    [pedidos],
  )

  if (loadingPedidos) return <div className="text-center py-10">Cargando pedidos...</div>

  return (
    <div className="container mx-auto py-10">
      {/* <div className="mb-6">
        <button
          onClick={handleCreatePedido}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Crear pedido desde carrito
        </button>
      </div> */}
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
