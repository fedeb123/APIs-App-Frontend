import { useState, useEffect, useReducer } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { User, Mail, Lock, Shield } from "lucide-react"
import useFetch from "../hooks/useFetch"
import useUser from "../hooks/useUser"


function reducer(state, action){
  switch(action.type) {
      case "ACTUALIZAR_CAMPO":
          //...state porque no queremos tocar los demas campos sino actualizar
          //el que este siendo cambiado
          //sino por actualizar un campo, se defaultea todo y solo se actualiza ese campo
          return {...state, [action.name]: action.value}
      case "RESET":
          return estadoInicialForm
      default:
          return state
  }
}

const estadoInicialForm = {
  nombre: '',
  apellido: '',
  telefono: '',
  direccion: '',
  password: '',
  confirmarPassword: '',    
}

export default function Perfil() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('jwtToken'))
  const [refresh, setRefresh] = useState(false)
  const [payload, setPayload] = useState(null)
  const [location, setLocation] = useState(null)
  const { user: userResponse, loading: userLoading } = useUser(token, refresh)
  const { response, loading, error } = useFetch(location, 'PUT', payload, token)

  const[form, dispatch] = useReducer(reducer, estadoInicialForm)

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if(!userLoading && userResponse) {
      setUser(userResponse)
      setLocation(`usuarios/${userResponse.id}`)
    }
  }, [userLoading, userResponse])

  useEffect(() => {
    if (response && !loading) {
      dispatch(({type: 'RESET'}))
      setRefresh(!refresh)
      window.location.reload()
    }
  }, [response, loading])

  useEffect(() => {
    if (!loading && error) {
      console.error(JSON.stringify(error))
      alert('Ha ocurrido un error en la actualizacion')
    }
  }, [loading, error])
  const handleChange = (e) => {
    dispatch({type: "ACTUALIZAR_CAMPO", name: e.target.name, value: e.target.value})
  }

  const handleEdit = () => {
    setIsEditing(true)
    dispatch({type: "RESET"})
    Object.entries({
      nombre: user?.nombre ?? '',
      apellido: user?.apellido ?? '',
      telefono: user?.telefono ?? '',
      direccion: user?.direccion ?? '',
      password: '',
    }).forEach(([name, value]) => dispatch({ type: 'ACTUALIZAR_CAMPO', name, value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = {
      nombre: form.nombre == user.nombre ? '' : form.nombre,
      apellido: form.apellido == user.apellido ? '' : form.apellido,
      telefono: form.telefono == user.telefono ? '' : form.telefono,
      password: form.password,
      email: '',
      direccion: form.direccion == user.direccion ? '' : form.direccion,          
    }
    setPayload(data)
  }
  
  const handleLogout = () => {
    localStorage.removeItem("jwtToken")
    localStorage.removeItem('user')
    navigate("/")
    window.location.reload()
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-8">
      {(!user && !userLoading) && (
        <Card className="max-w-md w-full text-center p-6">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">No has iniciado sesión.</p>
            <Button onClick={() => navigate("/login")}>Iniciar Sesión</Button>
          </CardContent>
        </Card>
      )}

      {(userLoading) && (
        <Card className="max-w-md w-full text-center p-6">
          <CardHeader>
            <CardTitle>Cargando Perfil...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Por Favor, Espere...</p>
          </CardContent>
        </Card>
      )}

      {(!userLoading && user) && (
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
                  <p className="text-lg">{user.nombre}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Apellido</p>
                  <p className="text-lg">{user.apellido}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Telefono</p>
                  <p className="text-lg">{user.telefono}</p>
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
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Direccion</p>
                  <p className="text-lg">{user.direccion == null ? 'Sin Declarar': user.direccion}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Contraseña</p>
                  <p className="text-lg">{"•".repeat(8)}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleEdit} className="flex-1">
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
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="apellido" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Apellido
                </label>
                <Input
                  id="apellido"
                  name="apellido"
                  type="text"
                  value={form.apellido}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="Telefono" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  telefono
                </label>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="Tu telefono"
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
                  value={null}
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
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Dejar en blanco para mantener la actual"
                />
                <p className="text-xs text-muted-foreground">
                  Solo completa este campo si deseas cambiar tu contraseña
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="direccion" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Direccion
                </label>
                <Input
                  id="direccion"
                  name="direccion"
                  type="text"
                  value={form.direccion}
                  onChange={handleChange}
                  placeholder="Tu direccion completa"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Guardar Cambios
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setform({
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
      </Card>)}
    </div>
  )
}
