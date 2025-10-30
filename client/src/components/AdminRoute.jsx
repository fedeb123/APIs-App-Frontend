import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export function AdminRoute() {
  const { user } = useAuth();

  // Si no hay usuario o el rol no es ADMIN, lo redirige a la página principal.
  if (!user || user.rol?.nombre !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  // Si es Admin, le permite ver el contenido de la ruta.
  return <Outlet />;
}