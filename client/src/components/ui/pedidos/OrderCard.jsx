import { Card } from "../Card"
import { Button } from "../Button"

export function OrderCard({ pedido, onConfirm, isPending = false }) {
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
    <Card className={`p-6 ${!isPending ? "opacity-80" : ""}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">Pedido #{pedido.id}</h3>
          <p className="text-sm text-gray-500">Fecha: {new Date(pedido.fechaPedido).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${isPending ? "text-orange-600" : "text-gray-700"}`}>
            ${pedido.precioTotal.toFixed(2)}
          </p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getEstadoColor(pedido.estado)}`}
          >
            {pedido.estado}
          </span>
        </div>
      </div>
      <div className="border-t pt-4 mb-4">
        <h4 className="font-semibold mb-2">Artículos:</h4>
        {pedido.detalles?.map((detalle) => (
          <div key={detalle.id} className="flex justify-between text-sm">
            <span>
              {detalle.nombreProducto} x{detalle.cantidad}
            </span>
            <span>${detalle.precioSubtotal.toFixed(2)}</span>
          </div>
        ))}
      </div>
      {isPending && (
        <div className="border-t mt-4 pt-4 text-right">
          <Button onClick={() => onConfirm(pedido)}>Confirmar Pedido</Button>
        </div>
      )}
    </Card>
  )
}
