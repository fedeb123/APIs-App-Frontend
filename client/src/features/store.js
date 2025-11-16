import { configureStore } from '@reduxjs/toolkit'
import productosReducer from './productosSlice'

export const store = configureStore({
    reducer: {
        productos: productosReducer
    }
});