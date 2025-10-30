import { Facebook, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Sobre Nosotros */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">
              Sobre Nosotros
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Somos una marca comprometida con la sustentabilidad.</li>
              <li>Trabajamos con productores locales y materiales nobles.</li>
              <li>Cada producto refleja respeto por la naturaleza.</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">
              Contacto
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📍 Buenos Aires, Argentina</li>
              <li>📞 +54 11 1234-5678</li>
              <li>✉️ info@huellanoble.com</li>
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">
              Seguinos
            </h3>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Facebook className="h-5 w-5" />
                <span>Facebook</span>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="h-5 w-5" />
                <span>Instagram</span>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Unite a nuestra comunidad y conocé nuestras novedades y lanzamientos.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Huella Noble. Todos los derechos reservados.</p>
          <p className="mt-2">Hecho con 💚 desde Argentina</p>
        </div>
      </div>
    </footer>
  )
}
