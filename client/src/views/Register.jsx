import { useReducer} from "react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Link } from "react-router-dom"

const apiUrl  = import.meta.env.VITE_APP_API_URL


const estadoInicialForm = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmarPassword: '',
    telefono: '',
}

/*
* useReducer es como una anidacion de useStates que tiene que ver entre si.
* https://es.react.dev/reference/react/useReducer
* @fedeb123
*/

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

function fetchPost(form) {
    const URL = `${apiUrl}/v1/auth/register`

    const data = {
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        email: form.email,
        password: form.password,
        direccion: null,
        rolId: 1            
    }

    console.log(JSON.stringify(data))

    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch(URL, options)
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        localStorage.setItem('jwtToken', data.accessToken)
    })
    .catch((error) => {
        console.error(error)
    })

}

const Register=()=>{

    const[form, dispatch] = useReducer(reducer, estadoInicialForm)

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (form.password !== form.confirmarPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        fetchPost(form)

        //dispatch({type: 'RESET'})
    };


    const handleChange = (e) => {
        dispatch({type: "ACTUALIZAR_CAMPO", name: e.target.name, value: e.target.value})
    }

    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <Card className="w-[350px] shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-bold text-primary">
                        Crear Cuenta
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                        name="nombre"
                        type="text"
                        placeholder="Nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        />
                        <Input
                        name="apellido"
                        type="text"
                        placeholder="Apellido"
                        value={form.apellido}
                        onChange={handleChange}
                        required
                        />
                        <Input
                        name="telefono"
                        type="text"
                        placeholder="Telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        required
                        />
                        <Input
                        name="email"
                        type="text"
                        placeholder="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        />
                        <Input
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={handleChange}
                        required
                        />
                        <Input
                        name="confirmarPassword"
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={form.confirmarPassword}
                        onChange={handleChange}
                        required
                        />
                        <Button type="submit" className="w-full">
                        Registrarse
                        </Button>
                    </form>
                    {/* Login Redireccion */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-neutral-600">
                            ¿Ya tenés cuenta?{" "}
                            <Link to="/login" className="inline-block" aria-label="Iniciar Sesion">
                            <Button size="sm" className="rounded-full" onClick={() => {
                                setShowModal(false)
                            }}>
                            Iniciá sesión
                            </Button>
                        </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Register;