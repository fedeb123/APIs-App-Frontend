"use client"

import { useState } from "react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { X } from "lucide-react"
import { Link } from "react-router-dom"

export function Llamativo() {
  const [showModal, setShowModal] = useState(false)

  return (
    <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 px-8 py-24 md:px-16 md:py-32">
        {/* Imagen Fondo */}
        <div className="absolute inset-0">
          <img
            src="/happy-puppy-and-kitten-sitting-together-on-grass-i.jpg"
            alt="Happy pets"
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Contenido */}
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-balance text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Lo mejor para tu mascota!
          </h1>
          <p className="mb-8 text-pretty text-lg text-white/90 md:text-xl">Registrate y Empezá a comprar!</p>
          <Button size="lg" className="rounded-full px-8 text-base" onClick={() => setShowModal(true)}>
            Compra ahora y Ahorra!
          </Button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            {/* Boton de cerrar */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Sub Header */}
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-2xl font-bold text-neutral-900">Crear Cuenta</h2>
              <p className="text-sm text-neutral-600">Registrate para empezar a comprar</p>
            </div>

            {/* Form Registro */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Nombre Completo
                </label>
                <Input id="name" type="text" placeholder="Juan Pérez" required />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Correo Electrónico
                </label>
                <Input id="email" type="email" placeholder="tu@email.com" required />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Contraseña
                </label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>

              <div>
                <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Confirmar Contraseña
                </label>
                <Input id="confirm-password" type="password" placeholder="••••••••" required />
              </div>

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
          </div>
        </div>
      )}
    </section>
  )
}
