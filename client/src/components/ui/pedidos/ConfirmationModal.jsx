import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../Card"
import { Button } from "../Button"
import { Input } from "../Input"

export function ConfirmationModal({ pedido, onClose, onConfirm }) {
  const [codigoDescuento, setCodigoDescuento] = useState("")
  const [precioFinal, setPrecioFinal] = useState(0)
  const [descuentoAplicado, setDescuentoAplicado] = useState(0)
  const [metodoPago, setMetodoPago] = useState("TRANSFERENCIA_BANCARIA")

  useEffect(() => {
    const precioBase = pedido.detalles.reduce((sum, d) => sum + d.precioSubtotal, 0)
    let descuento = 0
    const totalItems = pedido.detalles.reduce((sum, d) => sum + d.cantidad, 0)

    if (totalItems >= 5) descuento = 0.2
    else if (totalItems >= 3) descuento = 0.15
    else if (codigoDescuento.toUpperCase() === "FREEADMIN") descuento = 0.1

    setDescuentoAplicado(descuento)
    setPrecioFinal(precioBase * (1 - descuento))
  }, [codigoDescuento, pedido])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
      <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Confirmar Pedido #{pedido.id}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Resumen de la Compra:</h4>
            {pedido.detalles.map((d) => (
              <div key={d.id} className="flex justify-between text-sm">
                <span>
                  {d.nombreProducto} x{d.cantidad}
                </span>
                <span>${d.precioSubtotal.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
              <span>Subtotal</span>
              <span>${pedido.detalles.reduce((sum, d) => sum + d.precioSubtotal, 0).toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Código de Descuento</label>
            <Input
              placeholder="Ej: FreeAdmin"
              value={codigoDescuento}
              onChange={(e) => setCodigoDescuento(e.target.value)}
            />
            {descuentoAplicado > 0 && (
              <p className="text-sm text-green-600">¡Descuento del {(descuentoAplicado * 100).toFixed(0)}% aplicado!</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Método de Pago</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="TRANSFERENCIA_BANCARIA">Transferencia Bancaria</option>
              <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
              <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
              <option value="EFECTIVO">Efectivo</option>
            </select>
          </div>
          <div className="border-t mt-4 pt-4 text-right space-y-2">
            <p className="text-lg font-bold">Total a Pagar:</p>
            <p className="text-3xl font-extrabold text-orange-600">${precioFinal.toFixed(2)}</p>
          </div>
          <Button className="w-full" onClick={() => onConfirm(pedido.id, codigoDescuento, metodoPago, pedido.detalles)}>
            Confirmar Compra y Facturar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
