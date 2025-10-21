import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ShoppingBag, LogOut, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Se usa el contexto para obtener el usuario y la función logout
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  
  // El rol se obtiene directamente del estado global 'user'
  const userRole = user?.rol?.nombre;

  // Efecto para cerrar el menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    setIsDropdownOpen(false);
    navigate("/");
    window.location.reload();
  };

  return (
    // SE RESTAURÓ TODA LA ESTRUCTURA Y ESTILOS DEL HEADER
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* Logo restaurado */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-primary-foreground"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <span className="text-xl font-bold">Huella Noble</span>
        </Link>

        {/* Navegación restaurada */}
        <nav className="hidden items-center gap-2 md:flex">
          <Link to="/tienda" className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100">Tienda</Link>
          <Link to="/nosotros" className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100">Quienes Somos</Link>
          <Link to="/contacto" className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100">Contacto</Link>
        </nav>

        <div className="flex items-center gap-3">
          {!user ? ( // La condición ahora es simplemente si existe 'user' del contexto
            <button 
              className="inline-flex h-9 items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
              onClick={() => navigate("/login")}
            >
              Iniciar Sesión
            </button>
          ) : (
            <div className="relative">
              <button 
                ref={buttonRef} 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-medium transition-colors hover:bg-orange-100"
              >
                <User className="h-5 w-5" />
                Mi Perfil
              </button>

              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                >
                  {/* Links del dropdown restaurados */}
                  <Link to="/perfil" onClick={() => setIsDropdownOpen(false)} className="flex items-center rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 mx-1">
                    <User className="h-4 w-4 mr-3" />
                    Mis Datos
                  </Link>
                  <Link to="/pedidos" onClick={() => setIsDropdownOpen(false)} className="flex items-center rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 mx-1">
                    <ShoppingBag className="h-4 w-4 mr-3" />
                    Mis Pedidos
                  </Link>
                  
                  {/* Lógica condicional para el admin */}
                  {userRole === 'ADMIN' && (
                    <Link to="/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 mx-1">
                      <Shield className="h-4 w-4 mr-3" />
                      Administración
                    </Link>
                  )}

                  <button onClick={handleLogout} className="flex w-full items-center rounded-md px-4 py-2 text-sm text-red-600 hover:bg-red-50 mx-1">
                    <LogOut className="h-4 w-4 mr-3" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}