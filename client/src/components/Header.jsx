import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, User } from "lucide-react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"

export function Header() {
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUserToken = localStorage.getItem("jwtToken")
    if (storedUserToken) setUser(storedUserToken)
  }, [])

  // scroll hide header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) setHidden(true)
      else setHidden(false)
      setLastScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // click fuera para cerrar dropdown
  useEffect(() => {
    const onDocClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDocClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  const handleLoginClick = () => navigate("/login")
  const handleRegisterClick = () => navigate("/register")

  const handleLogout = () => {
    localStorage.removeItem("jwtToken")
    setUser(null)
    setOpen(false)
    navigate("/")
  }

  const toggleOpen = () => setOpen((v) => !v)

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
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
          <span className="text-xl font-bold">
            <Link to="/">Huella Noble</Link>
          </span>
        </div>

        {/* Navegación */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/tienda" className="text-sm font-medium transition-colors hover:text-primary">
            Tienda
          </Link>
          <Link to="/nosotros" className="text-sm font-medium transition-colors hover:text-primary">
            Quienes Somos
          </Link>
          <Link to="/contacto" className="text-sm font-medium transition-colors hover:text-primary">
            Contacto
          </Link>
        </nav>

        {/* Búsqueda + Sesión */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
          </div>

          {/* Si NO hay usuario */}
          {!user ? (
            <>
              <Button size="sm" className="rounded-full" onClick={handleLoginClick}>
                Iniciar Sesión
              </Button>
              <Button size="sm" className="rounded-full" onClick={handleRegisterClick}>
                Registrarse
              </Button>
            </>
          ) : (
            <Link
              to="/perfil"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ring-offset-background transition hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <User className="h-5 w-5" />
              <span>Mi Perfil</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
