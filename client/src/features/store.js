import { configureStore } from '@reduxjs/toolkit'
import productosReducer from './productosSlice'
import authReducer from './authSlice'
import { attachInterceptor } from './interceptor/axios' 

export const store = configureStore({
    reducer: {
        productos: productosReducer,
        auth: authReducer
    }
});

attachInterceptor(store);