import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from 'axios'

const apiUrl = import.meta.env.VITE_APP_API_URL;
const pedidosUrl = `${apiUrl}/pedidos`

const initialState = {
    cart: [],
    loading: false,
    error: null
}

export const fetchPedidos = createAsyncThunk('pedidos/fetch', async() => {
    const { data } = await axios.get(pedidosUrl)
    return data
});

const cartSlice = createSlice({
    name: 'productos',
    initialState,
    reducers: {}
})

export default cartSlice.reducer;