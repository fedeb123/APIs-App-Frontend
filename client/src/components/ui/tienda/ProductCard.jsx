import { ShoppingCart } from "lucide-react"
import { Card } from "../Card"
import { Button } from "../Button"

const imagesUrl = import.meta.env.VITE_APP_API_IMAGES_URL

export function ProductCard({ product, onAddToCart }) {
  return (
    <Card className="w-56 overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="aspect-square bg-gradient-to-br from-orange-100 to-pink-100 p-6">
        <img
          src={product.imageUrl ? imagesUrl + product.imageUrl : "/placeholder.svg"}
          alt={product.nombre}
          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{product.nombre}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{product.descripcion}</p>
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-2xl font-bold text-orange-600">${product.precio}</p>
            <p className={`text-xs ${product.stock < 10 ? "text-red-500" : "text-green-600"}`}>
              {product.stock < 10
                ? product.stock == 0
                  ? `No hay stock momentaneamente`
                  : `¡Solo ${product.stock} disponibles!`
                : `${product.stock} en stock`}
            </p>
          </div>
          <Button onClick={() => onAddToCart(product)} size="sm" className="gap-2" disabled={product.stock === 0}>
            <ShoppingCart className="h-4 w-4" />
            Agregar
          </Button>
        </div>
      </div>
    </Card>
  )
}
