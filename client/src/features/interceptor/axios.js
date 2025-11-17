import axios from 'axios'
import { logoutAndClear } from '../authSlice';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const requester = axios.create({
    baseURL: apiUrl
})

/*
* Esto es un middleware que hace 2 cosas, primero configura
* una url de base para toda request (que es la direccion del back del env)
* y luego intercepta todas las request de cualquier tipo para 
* inyectarles el token de usuario registrado
* 
* El interceptor de response detecta si hay problemas con vencimiento de token
* o manipulacion del mismo y realiza logout.
*/

export function attachInterceptor (store) {
    requester.interceptors.request.use((options) => {
        const state = store.getState();
        const token = state.auth.token;

        if (token) {
            options.headers.Authorization = `Bearer ${token}`
        }

        return options
    }, (error) => {
        return Promise.reject(error);
    })

    requester.interceptors.response.use((response) => response, (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logoutAndClear());
        }
        return Promise.reject(error);
    })
}

export default requester;