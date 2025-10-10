import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
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
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
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
    localStorage.removeItem("user")
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
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Buscar Producto" className="w-[200px] pl-9 lg:w-[250px]" />
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
            // Dropdown trigger + menu (un único trigger — evita lo de "dos textos")
            <div className="relative">
              {/* Trigger */}
              <button
                ref={buttonRef}
                onClick={toggleOpen}
                aria-haspopup="menu"
                aria-expanded={open}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ring-offset-background transition hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span className="hidden sm:inline">Hola, {user.name}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 8l4 4 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dropdown */}
              {open && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-lg border bg-popover p-2 shadow-lg"
                >
                  <Link
                    to="/perfil"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-primary/5"
                    onClick={() => setOpen(false)}
                  >
                    Perfil
                  </Link>
                  <Link
                    to="/pedidos"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-primary/5"
                    onClick={() => setOpen(false)}
                  >
                    Mis Pedidos
                  </Link>
                  <hr className="my-1 border-t" />
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-destructive/10"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
