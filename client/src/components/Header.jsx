"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User } from "lucide-react"
import useAuth from "../hooks/useAuth.jsx"
import { UserDropdown } from "./ui/header/UserDropdown"

export function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const userRole = user?.rol?.nombre

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
    navigate("/")
    window.location.reload()
  }

  return (
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
  )
}
