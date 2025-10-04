import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"

export default function Perfil() {
  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  if (!user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Card className="max-w-md w-full text-center p-6">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No has iniciado sesión.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="max-w-md w-full p-6">
        <CardHeader>
          <CardTitle>Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nombre</p>
            <p>{user.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Correo</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Contraseña</p>
            <p>{"•".repeat(8)}</p>
          </div>
          <Button className="w-full mt-4">Editar Perfil</Button>
        </CardContent>
      </Card>
    </div>
  )
}
