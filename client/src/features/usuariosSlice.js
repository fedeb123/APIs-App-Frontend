import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requester from "./interceptor/axios";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const usuariosUrl = `${apiUrl}/usuarios`;

export const fetchUsuarios = createAsyncThunk("usuarios/fetchUsuarios", async () => {
    const { data } = await requester.get(usuariosUrl);
    return data;
});

const usuariosSlice = createSlice({
    name: "usuarios",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsuarios.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsuarios.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.content || action.payload;
            })
            .addCase(fetchUsuarios.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default usuariosSlice.reducer;