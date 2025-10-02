import { Button } from "./ui/Button"

export function Llamativo() {
  return (
    <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 px-8 py-24 md:px-16 md:py-32">
        {/* Imagen Fondo */}
        <div className="absolute inset-0">
          <img src="/happy-puppy-and-kitten-sitting-together-on-grass-i.jpg" alt="Happy pets" className="h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Contenido */}
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-balance text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Lo mejor para tu mascota!
          </h1>
          <p className="mb-8 text-pretty text-lg text-white/90 md:text-xl">
            Registrate y Empeza a comprar!
          </p>
          <Button size="lg" className="rounded-full px-8 text-base">
            Compra ahora y Ahorra!
          </Button>
        </div>
      </div>
    </section>
  )
}
