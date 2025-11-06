import { Card } from "../Card"
import { Button } from "../Button"

export function OrderCard({ pedido, userMap, onUpdateEstado }) {
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800"
      case "CONFIRMADO":
        return "bg-green-100 text-green-800"
      case "ENVIADO":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">Pedido #{pedido.id}</h3>
          <p className="text-gray-600">Cliente: {`${userMap?.[pedido.clienteId]?.nombre} - #${pedido.clienteId}`}</p>
          <p className="text-sm text-gray-500">Fecha: {new Date(pedido.fechaPedido).toLocaleDateString()}</p>
          <p className="text-gray-600">Direccion de Envio: {userMap?.[pedido.clienteId]?.direccion}</p>
          <p className="text-gray-600">Telefono: {userMap?.[pedido.clienteId]?.telefono}</p>
          <p className="text-gray-600">Email: {userMap?.[pedido.clienteId]?.email}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-orange-600">${pedido.precioTotal.toFixed(2)}</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getEstadoColor(pedido.estado)}`}
          >
            {pedido.estado}
          </span>
        </div>
      </div>
      <div className="border-t pt-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">Artículos:</h4>
        {pedido.detalles.map((detalle) => (
          <div key={detalle.id} className="flex justify-between text-sm text-gray-700 mb-1">
            <span>
              {detalle.nombreProducto} x{detalle.cantidad}
            </span>
            <span>${detalle.precioSubtotal.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateEstado(pedido.id)}
          disabled={!(pedido.estado === "CONFIRMADO")}
        >
          Marcar Enviado
        </Button>
      </div>
    </Card>
  )
}
