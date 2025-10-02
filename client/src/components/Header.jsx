import { Search } from "lucide-react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <span className="text-xl font-bold">Huella Noble</span>
        </div>

        {/* Navegacion */}
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#tienda" className="text-sm font-medium transition-colors hover:text-primary">
            Tienda
          </a>
          <a href="#nosotros" className="text-sm font-medium transition-colors hover:text-primary">
            Quienes Somos
          </a>
          <a href="#contacto" className="text-sm font-medium transition-colors hover:text-primary">
            Contacto
          </a>
        </nav>

        {/* Barra de Busqueda */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Buscar Producto" className="w-[200px] pl-9 lg:w-[250px]" />
          </div>
          <Button size="sm" className="rounded-full">
            Buscar ahora!
          </Button>
        </div>
      </div>
    </header>
  )
}
