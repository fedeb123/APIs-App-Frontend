import { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { User, Mail, Lock, Phone } from "lucide-react"; // Importa el ícono del teléfono
import useFetch from "../hooks/useFetch";
import useUser from "../hooks/useUser";

function formReducer(state, action) {
  if (action.type === 'UPDATE_FIELD') {
    return { ...state, [action.field]: action.value };
  }
  return state;
}

export default function Perfil() {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem('jwtToken'));
  const [refresh, setRefresh] = useState(false);
  const { user, loading: userLoading } = useUser(token, refresh);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formState, dispatch] = useReducer(formReducer, {});

  const [updatePayload, setUpdatePayload] = useState(null);
  const [updateLocation, setUpdateLocation] = useState(null);
  const { response: updateResponse, error: updateError } = useFetch(updateLocation, 'PUT', updatePayload, token);

  useEffect(() => {
    if (user) {
      setUpdateLocation(`usuarios/${user.id}`);
    }
  }, [user]);

  useEffect(() => {
    if (updateResponse) {
      alert("Perfil actualizado con éxito.");
      setIsEditing(false);
      setRefresh(prev => !prev);
    }
    if (updateError) {
      alert(`Error al actualizar: ${updateError.body?.message || 'Error de servidor'}`);
    }
  }, [updateResponse, updateError]);

  const handleEditClick = () => {
    // Carga el estado del formulario con los datos actuales del usuario
    Object.keys(user).forEach(key => {
      dispatch({ type: 'UPDATE_FIELD', field: key, value: user[key] });
    });
    dispatch({ type: 'UPDATE_FIELD', field: 'newPassword', value: '' });
    setIsEditing(true);
  };

  const handleFormChange = (e) => {
    dispatch({ type: 'UPDATE_FIELD', field: e.target.name, value: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      nombre: formState.nombre,
      apellido: formState.apellido,
      telefono: formState.telefono,
      direccion: formState.direccion,
      password: formState.newPassword,
    };
    setUpdatePayload(payload);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload(); // Para asegurar que el header se actualice
  };

  if (userLoading) {
    return <div className="text-center py-10">Cargando perfil...</div>;
  }

  if (!user && !userLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Card className="text-center p-6">
            <p className="mb-4">Debes iniciar sesión para ver tu perfil.</p>
            <Button onClick={() => navigate("/login")}>Iniciar Sesión</Button>
        </Card>
      </div>
    );
  }

  return (
    // Contenedor principal para centrar la tarjeta
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            // --- VISTA DE SOLO LECTURA ---
            <div className="space-y-6">
              {/* Nueva estructura para cada campo de datos (icono + texto) */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <User className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Nombre</p>
                  <p className="text-lg">{user.nombre}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <User className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Apellido</p>
                  <p className="text-lg">{user.apellido}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <Phone className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Teléfono</p>
                  <p className="text-lg">{user.telefono}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <Mail className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Correo Electrónico</p>
                  <p className="text-lg">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">No se puede modificar</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <User className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Dirección</p>
                  <p className="text-lg">{user.direccion || 'No especificada'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <Lock className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Contraseña</p>
                  <p className="text-lg tracking-widest">{"••••••••"}</p>
                </div>
              </div>

              {/* Contenedor para los botones */}
              <div className="flex gap-4 pt-4">
                <Button onClick={handleEditClick} className="w-full">Editar Perfil</Button>
                <Button onClick={handleLogout} variant="outline" className="w-full">Cerrar Sesión</Button>
              </div>
            </div>
          ) : (
            // --- VISTA DE EDICIÓN ---
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* (El formulario de edición no cambia, ya es funcional) */}
              <div><label>Nombre</label><Input name="nombre" value={formState.nombre || ''} onChange={handleFormChange} /></div>
              <div><label>Apellido</label><Input name="apellido" value={formState.apellido || ''} onChange={handleFormChange} /></div>
              <div><label>Teléfono</label><Input name="telefono" value={formState.telefono || ''} onChange={handleFormChange} /></div>
              <div><label>Dirección</label><Input name="direccion" value={formState.direccion || ''} onChange={handleFormChange} /></div>
              <div><label>Nueva Contraseña (opcional)</label><Input name="newPassword" type="password" placeholder="Dejar en blanco para no cambiar" value={formState.newPassword || ''} onChange={handleFormChange} /></div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="w-full">Guardar Cambios</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="w-full">Cancelar</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
