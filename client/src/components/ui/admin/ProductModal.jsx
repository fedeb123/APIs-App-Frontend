import { X } from "lucide-react"
import { Card } from "../Card"
import { Input } from "../Input"
import { Button } from "../Button"

export function ProductModal({ show, editing, form, categories, onChange, onSave, onClose }) {
  if (!show) return null

  const handleSaveClick = () => {
    if (!form.nombre.trim()) return alert("El nombre es obligatorio")
    if (!form.descripcion.trim()) return alert("La descripción es obligatoria")
    if (!form.precio || isNaN(Number(form.precio))) return alert("El precio es inválido")
    if (!form.stock || isNaN(Number(form.stock))) return alert("El stock es inválido")
    if (!form.categoriaId) return alert("Debe seleccionar una categoría")
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
      <Card className="w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{editing ? "Editar Producto" : "Nuevo Producto"}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <Input
              value={form.nombre}
              onChange={(e) => onChange({ ...form, nombre: e.target.value })}
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <Input
              value={form.descripcion}
              onChange={(e) => onChange({ ...form, descripcion: e.target.value })}
              placeholder="Descripción del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
            <Input
              type="number"
              step="0.01"
              value={form.precio}
              onChange={(e) => onChange({ ...form, precio: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
            <Input
              type="number"
              value={form.stock}
              onChange={(e) => onChange({ ...form, stock: e.target.value })}
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adjuntar imagen</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) onChange({ ...form, imagenFile: file })
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              value={form.categoriaId}
              onChange={(e) => onChange({ ...form, categoriaId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombreCategoria}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleSaveClick} className="w-full">
            {editing ? "Actualizar" : "Crear"} Producto
          </Button>
        </div>
      </Card>
    </div>
  )
}
