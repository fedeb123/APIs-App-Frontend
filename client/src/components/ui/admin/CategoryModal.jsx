import { X } from "lucide-react"
import { Card } from "../Card"
import { Input } from "../Input"
import { Button } from "../Button"

export function CategoryModal({ show, editing, form, onChange, onSave, onClose }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
      <Card className="w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{editing ? "Editar Categoría" : "Nueva Categoría"}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <Input
              value={form.nombre}
              onChange={(e) => onChange({ ...form, nombre: e.target.value })}
              placeholder="Nombre de la categoría"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <Input
              value={form.descripcion}
              onChange={(e) => onChange({ ...form, descripcion: e.target.value })}
              placeholder="Descripción de la categoría"
            />
          </div>
          <Button onClick={onSave} className="w-full">
            {editing ? "Actualizar" : "Crear"} Categoría
          </Button>
        </div>
      </Card>
    </div>
  )
}