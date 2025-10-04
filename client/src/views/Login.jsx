import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    // Simulación de login (en real iría API)
    const fakeUser = { name: "Nicolas", email }
    localStorage.setItem("user", JSON.stringify(fakeUser))

    navigate("/") // vuelve al inicio
    window.location.reload() // refresca Header
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold text-primary">
            Iniciar Sesión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
