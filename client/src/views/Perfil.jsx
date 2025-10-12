import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { User, Mail, Lock, Shield } from "lucide-react"

export default function Perfil() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("jwtToken")
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const updatedUser = {
      ...user,
      name: formData.name,
      // Email and role remain unchanged
    }

    // If password was provided, you would handle it here (in a real app, send to API)
    if (formData.password) {
      // In a real app, this would be sent to the backend
      console.log("Nueva contraseña:", formData.password)
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)

    // Refresh to update header
    window.location.reload()
  }

  const handleLogout = () => {
    localStorage.removeItem("jwtToken")
    navigate("/")
    window.location.reload()
  }

  if (!user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Card className="max-w-md w-full text-center p-6">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">No has iniciado sesión.</p>
            <Button onClick={() => navigate("/login")}>Iniciar Sesión</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-8">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                  <p className="text-lg">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Correo Electrónico</p>
                  <p className="text-lg">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">No se puede modificar</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Contraseña</p>
                  <p className="text-lg">{"•".repeat(8)}</p>
                </div>
              </div>

              {user.role && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Rol</p>
                    <p className="text-lg capitalize">{user.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">No se puede modificar</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={() => setIsEditing(true)} className="flex-1">
                  Editar Perfil
                </Button>
                <Button onClick={handleLogout} variant="outline" className="flex-1 bg-transparent">
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nombre
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Correo Electrónico
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">El correo no se puede modificar</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Nueva Contraseña
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Dejar en blanco para mantener la actual"
                />
                <p className="text-xs text-muted-foreground">
                  Solo completa este campo si deseas cambiar tu contraseña
                </p>
              </div>

              {user.role && (
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Rol
                  </label>
                  <Input
                    id="role"
                    name="role"
                    type="text"
                    value={formData.role}
                    disabled
                    className="bg-muted cursor-not-allowed capitalize"
                  />
                  <p className="text-xs text-muted-foreground">El rol no se puede modificar</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Guardar Cambios
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      name: user.name || "",
                      email: user.email || "",
                      password: "",
                      role: user.role || "usuario",
                    })
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
