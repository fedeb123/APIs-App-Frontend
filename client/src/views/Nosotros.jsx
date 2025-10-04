import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Link } from "react-router-dom"
import { Heart, Award, Users, Shield } from "lucide-react"

export default function Nosotros() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Div llamativo tipo anuncio */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[rgb(0_157_137_/_0.22)] via-[rgb(0_157_137_/_0.12)] to-[rgb(0_157_137_/_0.04)] text-teal-950">
        <div className="absolute inset-0 bg-[rgb(255_255_255_/_0.35)] mix-blend-overlay pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Sobre Nosotros</h1>
          <p className="text-xl max-w-2xl mx-auto text-teal-800">
            Dedicados a mejorar la vida de tus mascotas con amor y calidad
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Bla Bla Bla sobre nosotros */}
        <Card className="mb-12 p-8 bg-white shadow-lg">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed">
              Bienvenidos a nuestra tienda en línea. Nos dedicamos a ofrecer los mejores productos para tus mascotas,
              desde alimentos hasta accesorios y juguetes. Nuestra misión es mejorar la vida de tus amigos peludos con
              productos de alta calidad y un servicio excepcional.
            </p>
          </div>
        </Card>

        {/* Grid de Valores */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="p-6 text-center hover:shadow-xl transition-shadow duration-300 bg-white">
            <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pasión</h3>
            <p className="text-gray-600">Amamos a los animales y nos dedicamos con el corazón</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-shadow duration-300 bg-white">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Calidad</h3>
            <p className="text-gray-600">Productos seleccionados con los más altos estándares</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-shadow duration-300 bg-white">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Comunidad</h3>
            <p className="text-gray-600">Un equipo de amantes de los animales a tu servicio</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-shadow duration-300 bg-white">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confianza</h3>
            <p className="text-gray-600">Seguridad y garantía en cada producto</p>
          </Card>
        </div>

        {/* Team Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 bg-gradient-to-br from-pink-50 to-white shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestro Equipo</h2>
            <p className="text-gray-700 leading-relaxed">
              Nuestro equipo está compuesto por amantes de los animales que entienden la importancia de cuidar y mimar a
              tus mascotas. Nos esforzamos por seleccionar cuidadosamente cada producto que ofrecemos, asegurándonos de
              que cumplan con los más altos estándares de calidad y seguridad.
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-blue-50 to-white shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestro Compromiso</h2>
            <p className="text-gray-700 leading-relaxed">
              Gracias por confiar en nosotros para cuidar de tus mascotas. Estamos aquí para ayudarte en cada paso del
              camino, desde la elección del producto adecuado hasta el servicio postventa. ¡Esperamos que disfrutes de
              tu experiencia de compra con nosotros!
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <Card
          className="p-12 text-center bg-gradient-to-r from-[rgb(0_157_137_/_0.15)] via-[rgb(0_157_137_/_0.06)] to-white text-teal-900 shadow-xl border border-[rgb(0_157_137_/_0.25)]"
        >
          <h2 className="text-3xl font-bold mb-4">¿Listo para cuidar mejor a tu mascota?</h2>
          <p className="text-xl text-teal-700 mb-6">Explora nuestra selección de productos premium</p>
          <Link to="/tienda" className="inline-block" aria-label="Ir a la tienda">
            <Button size="sm" className="rounded-full">
              Ver Productos
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
