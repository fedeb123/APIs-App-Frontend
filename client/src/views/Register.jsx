import { useState } from "react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Link } from "react-router-dom"

const Register=()=>{

    const [nombre,setNombre]=useState("")
    const [email,setEmail]=useState("")
    const [contraseña,setContraseña]=useState("")
    const [confirmarContraseña,setConfirmarContraseña]=useState("")
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (contraseña !== confirmarContraseña) {
            alert("Las contraseñas no coinciden");
            return;
        }
        const newUser = { nombre, email };
        localStorage.setItem("user", JSON.stringify(newUser));
        alert("Registro exitoso");
    };
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
                        type="text"
                        placeholder="Nombre completo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        />
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
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        required
                        />
                        <Input
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={confirmarContraseña}
                        onChange={(e) => setConfirmarContraseña(e.target.value)}
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