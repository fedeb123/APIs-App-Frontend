import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { X, Clock, ShoppingCart } from "lucide-react";
import useFetch from "../hooks/useFetch";
import useAuth from "../hooks/useAuth";

// --- COMPONENTE DEL MODAL DE CONFIRMACIÓN ---
// (Este componente no necesita cambios, ya es correcto)
const ConfirmationModal = ({ pedido, onClose, onConfirm }) => {
  const [codigoDescuento, setCodigoDescuento] = useState("");
  const [precioFinal, setPrecioFinal] = useState(0);
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [metodoPago, setMetodoPago] = useState('TRANSFERENCIA_BANCARIA');

  useEffect(() => {
    const precioBase = pedido.detalles.reduce((sum, d) => sum + d.precioSubtotal, 0);
    let descuento = 0;
    const totalItems = pedido.detalles.reduce((sum, d) => sum + d.cantidad, 0);

    if (totalItems >= 5) descuento = 0.20;
    else if (totalItems >= 3) descuento = 0.15;
    else if (codigoDescuento.toUpperCase() === 'FREEADMIN') descuento = 0.10;

    setDescuentoAplicado(descuento);
    setPrecioFinal(precioBase * (1 - descuento));
  }, [codigoDescuento, pedido]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
      <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Confirmar Pedido #{pedido.id}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}><X /></Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Resumen de la Compra:</h4>
            {pedido.detalles.map(d => (
              <div key={d.id} className="flex justify-between text-sm">
                <span>{d.nombreProducto} x{d.cantidad}</span>
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
            {descuentoAplicado > 0 && <p className="text-sm text-green-600">¡Descuento del {(descuentoAplicado * 100).toFixed(0)}% aplicado!</p>}
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
  );
};

// --- VISTA PRINCIPAL DE PEDIDOS (CON SECCIONES SEPARADAS) ---
export default function Pedidos() {
  const { token } = useAuth();
  const [refresh, setRefresh] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([])

  const { response: responsePedidos, loading: loadingPedidos } = useFetch('pedidos/usuario', 'GET', null, token, refresh);
  
  const [pedidoAConfirmar, setPedidoAConfirmar] = useState(null);
  const [confirmPayload, setConfirmPayload] = useState(null);
  const [confirmLocation, setConfirmLocation] = useState(null);

  const { response: responseConfirm, error: errorConfirm } = useFetch(confirmLocation, 'PUT', confirmPayload, token);

  const { response: responseProductos, loading: loadingProductos, error: errorProductos } = useFetch('productos', 'GET', null, null)
  
  const handleConfirmClick = (pedido) => setPedidoAConfirmar(pedido);
  const handleCloseModal = () => setPedidoAConfirmar(null);

  const handleConfirmSubmit = (pedidoId, codigo, metodoPago, detalles) => {
    
    let faltante = false

    detalles.map((item) => {
      if (((mapStockProductsById?.[item.productoId] ?? 0) - (item?.cantidad ?? 0)) < 0) {
        alert(`Momentaneamente no contamos con stock de: ${item.cantidad} para el producto: ${item.nombreProducto}. Intente mas tarde.`)
        faltante = true;
      }
    })

    if (faltante) {
      handleCloseModal()
      return;
    }

    setConfirmLocation(`pedidos/${pedidoId}/confirmar`);
    setConfirmPayload({ 
      codigoDescuento: codigo,
      metodoDePago: metodoPago 
    });
  };

  useEffect(() => {
    if (responseProductos && !loadingProductos) {
      setProductos(responseProductos.content)
    }
  }, [responseProductos, loadingProductos])

  useEffect(() => {
    if (errorProductos && !loadingProductos) {
      console.error(JSON.stringify(errorProductos))
      alert('Error al correlacionar stock de productos: ' + JSON.stringify(errorProductos))
    }
  }, [errorProductos, loadingProductos])
  
  useEffect(() => {
    if (responseConfirm) {
      alert("¡Pedido confirmado y facturado con éxito!");
      setPedidoAConfirmar(null);
      setRefresh(prev => !prev);
    }
    if (errorConfirm) {
      alert(`Error al confirmar el pedido: ${errorConfirm.body?.message || 'Error de servidor'}`);
    }
  }, [responseConfirm, errorConfirm]);

  const mapStockProductsById = useMemo(() => {
    if (!Array.isArray(productos) || productos.length == 0) {
      return
    } 
    return productos.reduce((accumulator, producto) => {
      if (producto?.id != null) {
        accumulator[producto.id] = producto.stock
        return accumulator
      }
    }, {})
  }, [productos])

  useEffect(() => {
    if (responsePedidos) setPedidos(responsePedidos || []);
  }, [responsePedidos]);

  // --- LÓGICA PARA SEPARAR LOS PEDIDOS ---
  const pedidosPendientes = useMemo(() => 
    pedidos.filter(p => p.estado === 'PENDIENTE'), 
    [pedidos]
  );

  const pedidosConfirmados = useMemo(() => 
    pedidos.filter(p => !(p.estado === 'PENDIENTE')), 
    [pedidos]
  );

  if (loadingPedidos) return <div className="text-center py-10">Cargando pedidos...</div>;

  return (
    <div className="container mx-auto py-10">
      {pedidoAConfirmar && (
        <ConfirmationModal pedido={pedidoAConfirmar} onClose={handleCloseModal} onConfirm={handleConfirmSubmit} />
      )}
      <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>
      
      {/* --- SECCIÓN DE PEDIDOS PENDIENTES --- */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <Clock /> Pedidos Pendientes
        </h2>
        {pedidosPendientes.length === 0 ? (
          <p className="text-gray-500">No tienes pedidos pendientes de confirmación.</p>
        ) : (
          <div className="grid gap-4">
            {pedidosPendientes.map((pedido) => (
              <Card key={pedido.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">Pedido #{pedido.id}</h3>
                    <p className="text-sm text-gray-500">Fecha: {new Date(pedido.fechaPedido).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">${pedido.precioTotal.toFixed(2)}</p>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 bg-yellow-100 text-yellow-800">{pedido.estado}</span>
                  </div>
                </div>
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-semibold mb-2">Artículos:</h4>
                  {pedido.detalles?.map((detalle) => (
                    <div key={detalle.id} className="flex justify-between text-sm">
                      <span>{detalle.nombreProducto} x{detalle.cantidad}</span>
                      <span>${detalle.precioSubtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4 text-right">
                  <Button onClick={() => handleConfirmClick(pedido)}>Confirmar Pedido</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* --- SECCIÓN DE HISTORIAL (CONFIRMADOS) --- */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <ShoppingCart /> Historial de Compras
        </h2>
        {pedidosConfirmados.length === 0 ? (
          <p className="text-gray-500">Aún no tienes compras confirmadas.</p>
        ) : (
          <div className="grid gap-4">
            {pedidosConfirmados.map((pedido) => (
              <Card key={pedido.id} className="p-6 opacity-80">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">Pedido #{pedido.id}</h3>
                    <p className="text-sm text-gray-500">Fecha: {new Date(pedido.fechaPedido).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-700">${pedido.precioTotal.toFixed(2)}</p>
                    {(pedido.estado === 'CONFIRMADO') && (
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 bg-green-100 text-green-800">{pedido.estado}</span>
                    )}
                    {(pedido.estado === 'ENVIADO') && (
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 bg-blue-100 text-blue-800">{pedido.estado}</span>
                    )}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Artículos:</h4>
                  {pedido.detalles?.map((detalle) => (
                    <div key={detalle.id} className="flex justify-between text-sm">
                      <span>{detalle.nombreProducto} x{detalle.cantidad}</span>
                      <span>${detalle.precioSubtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}