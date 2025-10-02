import { Facebook, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Tienda */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Tienda</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#comida" className="text-muted-foreground transition-colors hover:text-foreground">
                  Comida
                </a>
              </li>
              <li>
                <a href="#juguetes" className="text-muted-foreground transition-colors hover:text-foreground">
                  Juguetes
                </a>
              </li>
              <li>
                <a href="#accessorios" className="text-muted-foreground transition-colors hover:text-foreground">
                  Accessorios
                </a>
              </li>
            </ul>
          </div>

          {/* Sobre Nosotros */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Sobre Nosotros</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#nosotros" className="text-muted-foreground transition-colors hover:text-foreground">
                  Quienes Somos
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-muted-foreground transition-colors hover:text-foreground">
                  Contactanos
                </a>
              </li>
              <li>
                <a href="#envios" className="text-muted-foreground transition-colors hover:text-foreground">
                  Envios & Devoluciones
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Huella Noble. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
