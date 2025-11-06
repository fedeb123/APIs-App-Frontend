import { Pencil, Trash2 } from "lucide-react"
import { Card } from "../Card"
import { Button } from "../Button"

const imagesUrl = import.meta.env.VITE_APP_API_IMAGES_URL

export function ProductCard({ producto, onEdit, onDelete, showActions = true }) {
  return (
    <Card className="p-6">
      <div className="flex gap-6">
        <img
          src={producto.imageUrl ? imagesUrl + producto.imageUrl : "/placeholder.svg"}
          alt={producto.nombre}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{producto.nombre}</h3>
          <p className="text-gray-600 mb-3">{producto.descripcion}</p>
          <div className="flex gap-4 text-sm">
            <span className="text-gray-700">
              <strong>Precio:</strong> ${producto.precio}
            </span>
            <span className="text-gray-700">
              <strong>Stock:</strong> {producto.stock}
            </span>
          </div>
        </div>
        {showActions && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(producto)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(producto.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
