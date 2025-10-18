import { createContext, useState, useContext, useEffect } from "react";

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Crear el Proveedor del Contexto (un componente que envolverá la app)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));

  // Este efecto se ejecuta UNA VEZ cuando la app carga
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("jwtToken");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (userData, userToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("jwtToken", userToken);
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Crear un hook personalizado para usar el contexto fácilmente
export function useAuth() {
  return useContext(AuthContext);
}