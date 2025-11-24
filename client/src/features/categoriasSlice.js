import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requester from "./interceptor/axios"

const apiUrl = import.meta.env.VITE_APP_API_URL;
const categoriasUrl = `${apiUrl}/categorias`

export const fetchCategorias = createAsyncThunk('/categorias/fetchCategorias', async()=>{
    const {data} = await requester.get(categoriasUrl)
    return data //respuesta
})

export const fetchCategoriasDescontinuadas = createAsyncThunk("categorias/fetchCategoriasDescontinuadas", async () => {

    const {data} = await requester.get(`${categoriasUrl}/descontinuadas`);
    return data;
  }
);

export const createCategorias = createAsyncThunk('/categorias/crearCategoria', async(nuevaCategoria)=>{

    const {data} = await requester.post(categoriasUrl,nuevaCategoria)
    return data
})

export const updateCategoria = createAsyncThunk('categorias/updateCategoria', async({id, payload})=>{
    const {data} = await requester.put(`${categoriasUrl}/${id}`, payload)
    return data
})

export const deleteCategoria = createAsyncThunk("categorias/deleteCategoria", async (id) => {
    await requester.delete(`${categoriasUrl}/${id}`)
    return id
  }
)

export const reactivarCategoria = createAsyncThunk("categorias/reactivarCategoria",async (id) => {
    const { data } = await requester.put(`${categoriasUrl}/descontinuadas/reactivar/${id}`)
    return data
  }
)

const categoriasSlice = createSlice({
    name:'categorias',
    initialState: {
        categorias: [],
        categoriasDesc: [],
        loading: false,
        error: null
    },
    reducers: {},//sincrono
    extraReducers: (builder)=>{ //asincrono
        builder.
        addCase(fetchCategorias.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCategorias.fulfilled, (state, action)=>{ //donde se guarda la info de data
            state.loading = false;
            state.categorias = action.payload.content; //lo que guardo dentro del estado local de items
            state.error = null;
        })
        .addCase(fetchCategorias.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.error.message;//cada tipo de excepcion que creamos
        })

        .addCase(fetchCategoriasDescontinuadas.fulfilled, (state, action) => {
            state.categoriasDesc = action.payload.content;
        })
        .addCase(fetchCategoriasDescontinuadas.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchCategoriasDescontinuadas.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
        .addCase(createCategorias.fulfilled, (state,action)=>{
            state.categorias = [...state.categorias, action.payload];
        })
        .addCase(updateCategoria.fulfilled, (state,action)=>{
            const index = state.categorias.findIndex(categoria => categoria.id === action.payload.id)
            if (index !== -1){
                state.categorias[index] = action.payload;
            }
        })
        .addCase(deleteCategoria.fulfilled, (state, action) => {
            const id = action.payload;
            const categoria = state.categorias.find(c => c.id === id);

            state.categorias = state.categorias.filter(c => c.id !== id);

            if (categoria) {
                state.categoriasDesc.push({ ...categoria, activa: false });
            }        
        })
 
        .addCase(reactivarCategoria.fulfilled, (state, action) => {
            const id = action.payload.id

            const categoria = state.categoriasDesc.find(c => c.id === id)

            if (categoria) {
                // remover de descontinuadas
                state.categoriasDesc = state.categoriasDesc.filter(c => c.id !== id)
                // agregar a activas
                state.categorias.push(categoria)
        }})
    }
})

export default categoriasSlice.reducer

