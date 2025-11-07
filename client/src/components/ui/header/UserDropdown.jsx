import { useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { User, ShoppingBag, LogOut, Shield } from "lucide-react"

export function UserDropdown({ isOpen, onClose, userRole, onLogout }) {
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
    >
      <Link
        to="/perfil"
        onClick={onClose}
        className="flex items-center rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 mx-1"
      >
        <User className="h-4 w-4 mr-3" />
        Mis Datos
      </Link>
      <Link
        to="/pedidos"
        onClick={onClose}
        className="flex items-center rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 mx-1"
      >
        <ShoppingBag className="h-4 w-4 mr-3" />
        Mis Pedidos
      </Link>

      {userRole === "ADMIN" && (
        <Link
          to="/admin"
          onClick={onClose}
          className="flex items-center rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 mx-1"
        >
          <Shield className="h-4 w-4 mr-3" />
          Administración
        </Link>
      )}

      <button
        onClick={onLogout}
        className="flex w-full items-center rounded-md px-4 py-2 text-sm text-red-600 hover:bg-red-50 mx-1"
      >
        <LogOut className="h-4 w-4 mr-3" />
        Cerrar Sesión
      </button>
    </div>
  )
}
