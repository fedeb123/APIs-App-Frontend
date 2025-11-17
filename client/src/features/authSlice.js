import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from 'axios'

const apiUrl = import.meta.env.VITE_APP_API_URL;
const registerUrl = `${apiUrl}/v1/auth/register`
const loginUrl = `${apiUrl}/v1/auth/authenticate`

const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null
}

export const registerUser = createAsyncThunk('auth/register', async(userData) => {
    const { data } = await axios.post(registerUrl, userData)
    return data
});

export const loginUser = createAsyncThunk('auth/login', async(userCredentials) => {
    const { data } = await axios.post(loginUrl, userCredentials)
    return data
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null,
            state.token = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error?.message;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.token = action.payload.accessToken;
        })
    }
})

export default authSlice.reducer;