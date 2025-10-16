import { useEffect, useState } from "react"
import { useNavigate , Link} from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import useFetch from "../hooks/useFetch"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [payload, setPayload] = useState(null)
  const { response, loading, error } = useFetch('v1/auth/authenticate', 'POST', payload) 
  let navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const data = {
      email: email,
      password: password,
    }
    setPayload(data)
  }

  useEffect(() => {
    if (response) {
        localStorage.setItem('jwtToken', response.accessToken)
        navigate('/tienda')
        window.location.reload() // refresca el header
    }
  }, [response])

  useEffect(() => {
    if (error) {
      console.error(JSON.stringify(error))
      alert(`Ha ocurrido un error en el logueo: ${JSON.stringify(error)}`)
    }
  }, [error])

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
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              name="email"
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
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="relative font-semibold text-primary before:absolute before:-bottom-1 before:left-0 before:h-[2px] before:w-0 before:bg-primary before:transition-all hover:before:w-full"
              >
                Créala aquí
              </Link>
            </p>
          </div>
        </CardContent>
        
      </Card>
    </div>
  )
}
