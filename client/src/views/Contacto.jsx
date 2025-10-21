import { useState } from "react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Formulario enviado:", formData)
    alert('Su mensaje ha sido enviado!')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Seccion Debajo del Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Contáctanos</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            ¿Tienes alguna pregunta o comentario? Nos encantaría escucharte.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Card Info de Contacto */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-2xl">Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-sm text-muted-foreground">contacto@huellanoble.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Teléfono</h3>
                  <p className="text-sm text-muted-foreground">+54 9 11 1234-5678</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Dirección</h3>
                  <p className="text-sm text-muted-foreground">Av Siempre Viva 123</p>
                  <p className="text-sm text-muted-foreground">Springfield, EEUU</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-foreground mb-3">Horario de Atención</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes:</span>
                    <span className="font-medium">9:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado:</span>
                    <span className="font-medium">10:00 - 14:15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo:</span>
                    <span className="font-medium">Cerrado</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulario Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Envíanos un Mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-sm font-medium text-foreground">
                    Nombre Completo
                  </label>
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Correo Electrónico
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="mensaje" className="text-sm font-medium text-foreground">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    placeholder="Escribe tu mensaje aquí..."
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Mensaje
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}