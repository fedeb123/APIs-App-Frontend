import { configureStore } from '@reduxjs/toolkit'
import productosReducer from './productosSlice'
import authReducer from './authSlice'
import categoriasReducer from './categoriasSlice'
import { attachInterceptor } from './interceptor/axios' 

export const store = configureStore({
    reducer: {
        productos: productosReducer,
        auth: authReducer,
        categorias:categoriasReducer
    }
});

attachInterceptor(store);