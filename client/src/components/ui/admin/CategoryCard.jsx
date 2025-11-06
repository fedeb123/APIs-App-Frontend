import { Pencil, Trash2 } from "lucide-react"
import { Card } from "../Card"
import { Button } from "../Button"

export function CategoryCard({ categoria, onEdit, onDelete, showActions = true, showReactivar = false, onReactivar }) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{categoria.nombreCategoria}</h3>
          <p className="text-gray-600">{categoria.descripcion}</p>
        </div>
        {showReactivar && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onReactivar(categoria.id)}>Reactivar</Button>
          </div>
        )}
        {showActions && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(categoria)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(categoria.id)}
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
