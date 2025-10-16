import { useState, useEffect, useReducer } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { User, Mail, Lock, Pencil, Trash2, Plus, Package, Tag, ShoppingBag, X } from "lucide-react"
import useFetch from "../hooks/useFetch"
import useUser from "../hooks/useUser"

const getEstadoColor = (estado) => {
  switch (estado) {
    case "PENDIENTE":
      return "bg-yellow-100 text-yellow-800"
    case "ENVIADO":
      return "bg-blue-100 text-blue-800"
    case "COMPLETADO":
      return "bg-green-100 text-green-800"
    case "CANCELADO":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

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
  const [activeTab, setActiveTab] = useState('perfil')
  const [token, setToken] = useState(localStorage.getItem('jwtToken'))
  const [refresh, setRefresh] = useState(false)
  const [payload, setPayload] = useState(null)
  const [locationPut, setLocationPut] = useState(null)
  const [locationPedidos, setLocationPedidos] = useState(null)
  const [pedidos, setPedidos] = useState([])
  const { user: userResponse, loading: userLoading } = useUser(token, refresh)
  const { response: responsePut, loading: loadingPut, error: errorPut } = useFetch(locationPut, 'PUT', payload, token)
  const { response: responsePedidos, loading: loadingPedidos, error: errorPedidos } = useFetch(locationPedidos, 'GET', null, token)
  const[form, dispatch] = useReducer(reducer, estadoInicialForm)

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if(!userLoading && userResponse) {
      setUser(userResponse)
      setLocationPut(`usuarios/${userResponse.id}`)
      setLocationPedidos(`pedidos/usuario?usuarioEmail=${userResponse.email}`)
    }
  }, [userLoading, userResponse])

  useEffect(() => {
    if (!loadingPedidos && responsePedidos) {
      setPedidos(responsePedidos)
    }
  }, [loadingPedidos, responsePedidos])

  useEffect(() => {
    if (responsePut && !loadingPut) {
      dispatch(({type: 'RESET'}))
      setRefresh(!refresh)
      window.location.reload()
    }
  }, [responsePut, loadingPut])

  useEffect(() => {
    if (!loadingPut && errorPut) {
      console.error(JSON.stringify(errorPut))
      alert('Ha ocurrido un error en la actualizacion')
    }
  }, [loadingPut, errorPut])

  useEffect(() => {
    if (!loadingPedidos && errorPedidos) {
      console.error(JSON.stringify(errorPedidos))
      alert('Ha ocurrido un error en la actualizacion')
    }
  }, [loadingPedidos, errorPedidos])


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
    <>
      {(!user && !userLoading) && (
      <div className="flex min-h-[80vh] items-center justify-center py-8">
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
      )}

      {(userLoading) && (
      <div className="flex min-h-[80vh] items-center justify-center py-8">
        <Card className="max-w-md w-full text-center p-6">
          <CardHeader>
            <CardTitle>Cargando Perfil...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Por Favor, Espere...</p>
          </CardContent>
        </Card>
      </div>
      )}

      {(!userLoading && user) && (
        <>
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("perfil")}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === "perfil"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Tag className="w-5 h-5" />
            Mi Perfil
          </button>
          <button
            onClick={() => setActiveTab("pedidos")}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === "pedidos"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Mis Pedidos
          </button>
        </div>

      {activeTab === 'perfil' && (
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
        {activeTab === "pedidos" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Pedidos</h2>

            <div className="grid gap-4">
              {pedidos.length != 0 &&pedidos.map((pedido) => (
                <Card key={pedido.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">Pedido #{pedido.id}</h3>
                      <p className="text-gray-600">
                       #IdCliente: {pedido.clienteId} - {user.email}
                      </p>
                      <p className="text-sm text-gray-500">Fecha: {pedido.fechaPedido}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">${pedido.precioTotal.toFixed(2)}</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getEstadoColor(pedido.estado)}`}
                      >
                        {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Artículos:</h4>
                    {pedido.detalles.map((detalle, index) => (
                      <div key={index} className="flex justify-between text-sm text-gray-700 mb-1">
                        <span>
                          {detalle.producto} x{detalle.cantidad}
                        </span>
                        <span>${(detalle.precio * detalle.cantidad).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
              {pedidos.length === 0 && (
                <Card className="p-8 text-center border-2 border-dashed border-muted-foreground/20 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900/40 dark:to-neutral-900">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                    <Package className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Aún no tenés pedidos</h3>
                  <p className="text-sm text-muted-foreground mb-6">Cuando compres, tus pedidos aparecerán acá.</p>
                  <Link to="/tienda" className="inline-block" aria-label="Ir a la tienda">
                    <Button size="sm" className="rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20">
                      Ir a la Tienda
                    </Button>
                  </Link>
                </Card>
              )}
            </div>
          </div>
      )}
      </>)}
    </>
  )
}
