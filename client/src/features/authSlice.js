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
    const { data } = await axios.post(registerUrl)
    return data
});

export const loginUser = createAsyncThunk('auth/login', async(userCredentials) => {
    const { data } = await axios.post(loginUrl)
    return data
});

const cartSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase()
    }
})

export default cartSlice.reducer;