import { useState, useEffect, useMemo } from "react"
import { Clock, ShoppingCart } from "lucide-react"
import useFetch from "../hooks/useFetch"
import useAuth from "../hooks/useAuth"
import { ConfirmationModal } from "../components/ui/pedidos/ConfirmationModal"
import { OrderCard } from "../components/ui/pedidos/OrderCard"

export default function Pedidos() {
  const { token } = useAuth()
  const [refresh, setRefresh] = useState(false)
  const [pedidos, setPedidos] = useState([])
  const [productos, setProductos] = useState([])

  const { response: responsePedidos, loading: loadingPedidos } = useFetch(
    "pedidos/usuario",
    "GET",
    null,
    token,
    refresh,
  )

  const [pedidoAConfirmar, setPedidoAConfirmar] = useState(null)
  const [confirmPayload, setConfirmPayload] = useState(null)
  const [confirmLocation, setConfirmLocation] = useState(null)

  const { response: responseConfirm, error: errorConfirm } = useFetch(confirmLocation, "PUT", confirmPayload, token)
  const {
    response: responseProductos,
    loading: loadingProductos,
    error: errorProductos,
  } = useFetch("productos", "GET", null, null)

  const handleConfirmClick = (pedido) => setPedidoAConfirmar(pedido)
  const handleCloseModal = () => setPedidoAConfirmar(null)

  const handleConfirmSubmit = (pedidoId, codigo, metodoPago, detalles) => {
    let exepcionFaltante = false
    let exepcionDescontinuado = false

    detalles.map((item) => {
      if (mapStockAndStateProductsById?.[item.productoId] == undefined) {
        alert(`Momentaneamente no comercializamos el producto: ${item.nombreProducto}. Intente mas tarde.`)
        exepcionDescontinuado = true
      }

      if (
        !exepcionDescontinuado &&
        (mapStockAndStateProductsById?.[item.productoId]?.stock ?? 0) - (item?.cantidad ?? 0) < 0
      ) {
        alert(
          `Momentaneamente no contamos con stock de: ${item.cantidad} para el producto: ${item.nombreProducto}. Intente mas tarde.`,
        )
        exepcionFaltante = true
      }
    })

    if (exepcionFaltante || exepcionDescontinuado) {
      handleCloseModal()
      return
    }

    setConfirmLocation(`pedidos/${pedidoId}/confirmar`)
    setConfirmPayload({
      codigoDescuento: codigo,
      metodoDePago: metodoPago,
    })
  }

  useEffect(() => {
    if (responseProductos && !loadingProductos) {
      setProductos(responseProductos.content)
    }
  }, [responseProductos, loadingProductos])

  useEffect(() => {
    if (errorProductos && !loadingProductos) {
      console.error(JSON.stringify(errorProductos))
      alert("Error al correlacionar stock de productos: " + JSON.stringify(errorProductos))
    }
  }, [errorProductos, loadingProductos])

  useEffect(() => {
    if (responseConfirm) {
      alert("¡Pedido confirmado y facturado con éxito!")
      setPedidoAConfirmar(null)
      setRefresh((prev) => !prev)
    }
    if (errorConfirm) {
      alert(`Error al confirmar el pedido: ${errorConfirm.body?.message || "Error de servidor"}`)
    }
  }, [responseConfirm, errorConfirm])

  const mapStockAndStateProductsById = useMemo(() => {
    if (!Array.isArray(productos) || productos.length == 0) return
    return productos.reduce((accumulator, producto) => {
      if (producto?.id != null) {
        accumulator[producto.id] = { stock: producto.stock, activo: producto.activo }
        return accumulator
      }
    }, {})
  }, [productos])

  useEffect(() => {
    if (responsePedidos) setPedidos(responsePedidos || [])
  }, [responsePedidos])

  const pedidosPendientes = useMemo(() => pedidos.filter((p) => p.estado === "PENDIENTE"), [pedidos])

  const pedidosConfirmados = useMemo(() => pedidos.filter((p) => !(p.estado === "PENDIENTE")), [pedidos])

  if (loadingPedidos) return <div className="text-center py-10">Cargando pedidos...</div>

  return (
    <div className="container mx-auto py-10">
      {pedidoAConfirmar && (
        <ConfirmationModal pedido={pedidoAConfirmar} onClose={handleCloseModal} onConfirm={handleConfirmSubmit} />
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
