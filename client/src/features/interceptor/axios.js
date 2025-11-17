import axios from 'axios'
import store from '../store'

const apiUrl = import.meta.env.VITE_APP_API_URL;

const requester = axios.create({
    baseURL: apiUrl
})

/*
* Esto es un middleware que hace 2 cosas, primero configura
* una url de base para toda request (que es la direccion del back del env)
* y luego intercepta todas las request de cualquier tipo para 
* inyectarles el token de usuario registrado
*/

requester.interceptors.request.use((options) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
        options.headers.Authorization = `Bearer ${token}`
    }

    return options
}, (error) => {
    Promise.reject(error);
})

export default requester;