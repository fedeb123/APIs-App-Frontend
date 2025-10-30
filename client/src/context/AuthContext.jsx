import { createContext, useState, useContext, useEffect } from "react";
import useFetch from "../hooks/useFetch";

// Crea el Contexto
export const AuthContext = createContext();

// Proveedor del Contexto (envuelve la App se usa desde cualquier lado)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(false)
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [usuarioEndpoint, setUsuarioEndpoint] = useState(null)
  const { response: profile, loading: loadingProfile, error: errorProfile } = useFetch(usuarioEndpoint, 'GET', null, token, refresh)

  // Este efecto se ejecuta UNA VEZ cuando la app carga
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      setUsuarioEndpoint('usuarios/usuario')
    }
  }, [token])

  useEffect(() => {
    if (profile && !loadingProfile){
      localStorage.setItem('user', JSON.stringify(profile))
      setUser(profile)
    }
  }, [loadingProfile, profile])

  useEffect(() => {
    if (!loadingProfile && errorProfile) {
      console.error('Error en Autenticacion: ' + JSON.stringify(errorProfile))
    }
  }, [loadingProfile, errorProfile])

  const login = (userToken) => {
    localStorage.setItem("jwtToken", userToken);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
    setUser(null);
    setToken(null);
  };

  const refreshUser = () => {
    if (!token) {
      return
    }
    setRefresh(prev => !prev)
  }

  return (
    <AuthContext.Provider value={{ user, token, loadingProfile, errorProfile, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}