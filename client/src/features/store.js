import { configureStore } from '@reduxjs/toolkit'
import productosReducer from './productosSlice'
import authReducer from './authSlice'
import { attachInterceptor } from './interceptor/axios' 
import pedidosReducer from "./pedidosSlice"

export const store = configureStore({
    reducer: {
        productos: productosReducer,
        pedidos: pedidosReducer,
        auth: authReducer
    }
});

attachInterceptor(store);