import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../features/authSlice';
import { useEffect } from 'react';

export function AdminRoute() {
  const dispatch = useDispatch()
  const {user, loading, error} = useSelector((state) => state.auth)

  useEffect(()=>{
    dispatch(fetchUser())
  }, [dispatch])

  // Si no hay usuario o el rol no es ADMIN, lo redirige a la página principal.
  if (!user || user.rol?.nombre !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  // Si es Admin, le permite ver el contenido de la ruta.
  return <Outlet />;
}