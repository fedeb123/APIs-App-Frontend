import { configureStore } from '@reduxjs/toolkit'
import productosReducer from './productosSlice'
import authReducer from './authSlice'

export const store = configureStore({
    reducer: {
        productos: productosReducer,
        auth: authReducer
    }
});