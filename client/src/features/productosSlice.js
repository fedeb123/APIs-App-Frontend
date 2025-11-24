import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import requester from "./interceptor/axios";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const productosUrl = `${apiUrl}/productos`

const initialState = {
    productos: [],
    productosDescontinuados: [],
    loading: false,
    error: null
}

//Trae todos los productos
export const fetchProductos = createAsyncThunk('productos/fetch', async() => {
    const { data } = await requester.get(productosUrl)
    return data
});

//Trae los productos con stock
export const fetchProductosStockeados = createAsyncThunk('productos/fetchStockeados', async() => {
    const { data } = await requester.get(`${productosUrl}/stockeados`)
    return data
});

//Trae los productos descontinuados
export const fetchProductosDescontinuados = createAsyncThunk('productos/fetchDescontinuados', async() => {
    const { data } = await requester.get(`${productosUrl}/descontinuados`)
    return data
});

export const createProducto = createAsyncThunk('productos/create', async(formData) => {
    const { data } = await requester.post(productosUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    return data
});

export const updateProducto = createAsyncThunk('productos/update', async({ id, formData }) => {
    const { data } = await requester.put(`${productosUrl}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    return data
});

export const deleteProducto = createAsyncThunk('productos/delete', async(id) => {
    await requester.delete(`${productosUrl}/${id}`)
    return id
});

export const reactivarProducto = createAsyncThunk('productos/reactivar', async(id) => {
    const { data } = await requester.put(`${productosUrl}/descontinuados/reactivar/${id}`, {})
    return data
});

const productosSlice = createSlice({
    name: 'productos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductos.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchProductos.rejected, (state, action) => { state.loading = false; state.error = action.error?.message; })
            .addCase(fetchProductos.fulfilled, (state, action) => {
                state.loading = false;
                state.productos = action.payload.content || action.payload
            })
            //Fetch de productos con stock
            .addCase(fetchProductosStockeados.pending, (state) => { state.loading = true; })
            .addCase(fetchProductosStockeados.fulfilled, (state, action) => {
                state.loading = false;
                state.productos = action.payload.content || action.payload
            })
            
            //Fetch de productos descontinuados
            .addCase(fetchProductosDescontinuados.fulfilled, (state, action) => {
                state.productosDescontinuados = action.payload.content || action.payload
            })

            .addCase(createProducto.fulfilled, (state, action) => {
                state.productos.push(action.payload)
            })

            .addCase(updateProducto.fulfilled, (state, action) => {
                const index = state.productos.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.productos[index] = action.payload;
            })

            .addCase(deleteProducto.fulfilled, (state, action) => {
                const id = action.payload
                const producto = state.productos.find(p => p.id === id)
                state.productos = state.productos.filter(p => p.id !== id)
                
                if (producto) {
                    state.productosDescontinuados.push({ ...producto, activo: false })
                }
            })

            .addCase(reactivarProducto.fulfilled, (state, action) => {
                const producto = action.payload
                state.productosDescontinuados = state.productosDescontinuados.filter(p => p.id !== producto.id)
                state.productos.push(producto)
            })
    }
})

export default productosSlice.reducer;