import { Card } from "../Card"

export function UserCard({ user }) {
  return (
    <Card className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {user.nombre ?? "-"} {user.apellido ?? "-"}
          </h3>
          <p className="text-sm text-gray-500">ID: {user.id ?? "-"}</p>
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
          {user.rol?.nombre ?? "Sin rol"}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
        <div>
          <span className="block text-sm text-gray-500">Teléfono</span>
          <span className="font-medium">{user.telefono ?? "-"}</span>
        </div>

        <div>
          <span className="block text-sm text-gray-500">Dirección</span>
          <span className="font-medium">{user.direccion ?? "-"}</span>
        </div>

        <div>
          <span className="block text-sm text-gray-500">Email</span>
          <span className="font-medium">{user.email ?? "-"}</span>
        </div>

        <div>
          <span className="block text-sm text-gray-500">Pedidos</span>
          <span className="font-medium">
            {Array.isArray(user.pedidos) ? user.pedidos.length : (user.pedidosCount ?? 0)}
          </span>
        </div>
      </div>
    </Card>
  )
}
