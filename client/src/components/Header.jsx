import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, ShoppingCart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { UserDropdown } from "./ui/header/UserDropdown"
import { CartDrawer } from "./ui/cart/CartDrawer"

import { logoutAndClear } from "../features/authSlice"

export function Header() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { cantidad } = useSelector((state) => state.cart)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const dispatch = useDispatch()

  const userRole = user?.rol?.nombre
  const cartCount = cantidad

  const handleLogout = () => {
    dispatch(logoutAndClear());
    setIsDropdownOpen(false)
    navigate("/")
  }

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-primary-foreground"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <span className="text-xl font-bold">Huella Noble</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link to="/tienda" className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100">
            Tienda
          </Link>
          <Link to="/nosotros" className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100">
            Quienes Somos
          </Link>
          <Link to="/contacto" className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100">
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {!user ? (
            <button
              className="inline-flex h-9 items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
              onClick={() => navigate("/login")}
            >
              Iniciar Sesión
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-medium transition-colors hover:bg-orange-100"
              >
                <User className="h-5 w-5" />
                Mi Perfil
              </button>

              <UserDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                userRole={userRole}
                onLogout={handleLogout}
              />
            </div>
          )}
        </div>
      </div>
    </header>
    <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
