//Estaria bueno agregar mis pedidos como si fuera un boton en el header que te lleve a esta vista
//o desde un deplegable en perfil. En lugar de una integracion dentro de perfil como está hecho 
//ahora. By NicooVega

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import useFetch from "../hooks/useFetch";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const token = localStorage.getItem('jwtToken');

  // Hook para obtener los pedidos del usuario logueado
  const { response: pedidosResponse, error: pedidosError } = useFetch('pedidos/usuario', 'GET', null, token);

  useEffect(() => {
    if (pedidosResponse) {
      // La API devuelve un array directamente, no un objeto paginado
      setPedidos(pedidosResponse || []);
    }
    if (pedidosError) {
      console.error("Error al obtener los pedidos:", pedidosError);
    }
  }, [pedidosResponse, pedidosError]);

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
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <p><span className="font-medium">Fecha:</span> {new Date(pedido.fechaPedido).toLocaleDateString()}</p>
                    <p><span className="font-medium">Estado:</span> {pedido.estado}</p>
                  </div>
                  <p className="text-2xl font-bold">${pedido.precioTotal.toFixed(2)}</p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Artículos:</h4>
                  <div className="space-y-1">
                    {pedido.detalles && pedido.detalles.map((detalle) => (
                      <div key={detalle.id} className="flex justify-between text-sm">
                        <span>{detalle.nombreProducto} x{detalle.cantidad}</span>
                        <span>${detalle.precioSubtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}