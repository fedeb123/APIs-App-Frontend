import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import requester from "./interceptor/axios";

const initialState = {
    productos: [],
    loading: false,
    error: null
}

export const fetchProductos = createAsyncThunk('productos/fetch', async() => {
    const { data } = await requester.get('/productos')
    return data
});

const productosSlice = createSlice({
    name: 'productos',
    initialState,
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
            state.productos = action.payload.content
        })
    }
})

export default productosSlice.reducer;