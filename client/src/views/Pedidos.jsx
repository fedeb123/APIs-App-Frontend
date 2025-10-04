import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    // 🔹 Esto es simulado. Reemplazalo con fetch a tu backend.
    const fakePedidos = [
      { id: 1, fecha: "2025-09-20", estado: "Pendiente", total: 3200 },
      { id: 2, fecha: "2025-08-05", estado: "Pagado", total: 15000 },
      { id: 3, fecha: "2025-07-18", estado: "Enviado", total: 8200 },
    ]
    setPedidos(fakePedidos)
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>

      {pedidos.length === 0 ? (
        <p className="text-muted-foreground">Todavía no realizaste pedidos.</p>
      ) : (
        <div className="grid gap-4">
          {pedidos.map((pedido) => (
            <Card key={pedido.id}>
              <CardHeader>
                <CardTitle>Pedido #{pedido.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <span className="font-medium">Fecha:</span> {pedido.fecha}
                </p>
                <p>
                  <span className="font-medium">Estado:</span> {pedido.estado}
                </p>
                <p>
                  <span className="font-medium">Total:</span> ${pedido.total}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
