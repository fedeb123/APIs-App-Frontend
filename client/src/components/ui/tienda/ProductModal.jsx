import { X } from "lucide-react"
import { Button } from "../Button"

const imagesUrl = import.meta.env.VITE_APP_API_IMAGES_URL

export function ProductModal({ product, quantity, onQuantityChange, onClose, onConfirm }) {
  if (!product) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md hover:bg-gray-100 hover:text-gray-900 transition"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-orange-50 via-rose-50 to-pink-100 p-8 flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-sm rounded-2xl bg-white/70 shadow-inner ring-1 ring-gray-200 flex items-center justify-center">
              <img
                src={product.imageUrl ? imagesUrl + product.imageUrl : "/placeholder.svg"}
                alt={product.nombre}
                className="max-h-[320px] object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          <div className="p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-3xl font-bold text-gray-900 leading-tight">{product.nombre}</h3>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                    product.stock < 10
                      ? "bg-red-50 text-red-700 ring-red-200"
                      : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  }`}
                >
                  {product.stock < 10 ? `Quedan ${product.stock}` : "En stock"}
                </span>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.descripcion}</p>

              <div className="space-y-1">
                <span className="block text-xs uppercase tracking-wide text-gray-500">Precio</span>
                <span className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  ${product.precio}
                </span>
              </div>

              <div className="mt-6">
                <label htmlFor="cantidad" className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Cantidad
                </label>
                <select
                  id="cantidad"
                  aria-label="Cantidad"
                  className="w-full md:w-40 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-60"
                  value={quantity}
                  onChange={(e) => onQuantityChange(Number(e.target.value))}
                  disabled={product.stock === 0}
                >
                  {Array.from({ length: Math.max(0, Math.min(product.stock ?? 0, 10)) }, (_, i) => i + 1).map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl bg-transparent"
                onClick={onClose}
              >
                Cerrar
              </Button>
              <Button
                onClick={onConfirm}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-pink-600 transition disabled:opacity-60 disabled:shadow-none"
                disabled={product.stock === 0}
              >
                Comprar Ahora!
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
