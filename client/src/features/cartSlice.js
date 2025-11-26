import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import requester from "./interceptor/axios";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const pedidosUrl = `${apiUrl}/pedidos`

const initialState = {
    cart: [],
    precioTotal: 0,
    cantidad: 0,
    loading: false,
    error: null
}

const calcularTotales = (cart) => {
    return cart.reduce((total, item) => {
        total.precio += item.precio * item.cantidad
        total.cantidad += item.cantidad
    })
}


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {

            const { producto, cantidad = 1 } = action.payload

            if (!producto || producto.id == null) {
                return
            }

            const itemExistente = state.cart.find((item) => {
                item.id === producto.id
            })

            if (!itemExistente) {
                state.cart.push =({...producto, cantidad: cantidad})
                const totales = calcularTotales(state.cart)
                state.precio = totales.precio
                state.cantidad = totales.cantidad
            }
        },
        removeFromCart: (state, action) => {
            const id = action.payload

            if (!id) return;

            state.cart = state.cart.filter((item) => {
                item.id !== id
            })

            const totales = calcularTotales(state.cart)
            state.precio = totales.precio
            state.cantidad = totales.cantidad
        },
        updateQuantity: (state, action) => {

            const { id, cantidadNueva } = action.payload
            
            if (!id || cantidadNueva === 0) {
                return;
            }

            state.cart.map((item) => {
                item.id === producto.id ? {...item, cantidad: Math.max(1, Math.min(cantidadNueva, item.stock))} : item
            })

            const totales = calcularTotales(state.cart)
            state.precio = totales.precio
            state.cantidad = totales.cantidad
        },
        clearCart: (state) => {
            state.cart = []
            state.precio = 0
            state.cantidad = 0
        }

    }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;