import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from 'axios'

const apiUrl = import.meta.env.VITE_APP_API_URL;
const productosUrl = `${apiUrl}/productos`

const initialState = {
    productos: [],
    loading: false,
    error: null
}

export const fetchProductos = createAsyncThunk('productos/fetch', async() => {
    const { data } = await axios.get(productosUrl)
    return data
});

const productosSlice = createSlice({
    name: 'productos',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProductos.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProductos.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error?.message;
        })
        .addCase(fetchProductos.fulfilled, (state, action) => {
            state.loading = false;
            state.productos = [...state.productos, action.payload?.content || []];
        })
    }
})

export default productosSlice.reducer;