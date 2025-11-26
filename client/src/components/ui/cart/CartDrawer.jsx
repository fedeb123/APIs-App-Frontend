import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useNavigate } from "react-router-dom"

import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateQuantity, clearCart } from '../../../features/cartSlice'

const imagesUrl = import.meta.env.VITE_APP_API_IMAGES_URL

export function CartDrawer({ isOpen, onClose }) {
  const { cart, precioTotal, cantidad } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleCheckout = () => {
    if (!user) {
      alert("Tienes que estar logueado para comprar")
      onClose()
      navigate("/login")
      return
    }

    if (!user.direccion) {
      alert("Carga tu dirección antes de comprar")
      onClose()
      navigate("/perfil")
      return
    }

    // Navegar a pedidos con el carrito
    navigate("/pedidos", { state: { cart } })
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-bold">Carrito</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm">Agrega productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b last:border-0">
                  <img
                    src={item.imageUrl ? imagesUrl + item.imageUrl : "/placeholder.svg"}
                    alt={item.nombre}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 truncate">{item.nombre}</h3>
                    <p className="text-orange-600 font-bold text-lg mb-2">
                      ${item.precio}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(updateQuantity({id: item.id, cantidadNueva: item.cantidad - 1}))}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        disabled={item.cantidad <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => dispatch(updateQuantity({id: item.id, cantidadNueva: item.cantidad + 1}))}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        disabled={item.cantidad >= item.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => dispatch(removeFromCart({id: item.id}))}
                        className="ml-auto p-1 hover:bg-red-50 rounded transition-colors text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t px-6 py-4 space-y-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-orange-600">${precioTotal}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Finalizar Compra
            </button>
            
            <button
              onClick={() => dispatch(clearCart())}
              className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium py-2"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  )
}
