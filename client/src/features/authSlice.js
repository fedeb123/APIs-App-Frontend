import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import requester from "./interceptor/axios";
import { PURGE } from "redux-persist";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const registerUrl = `${apiUrl}/v1/auth/register`
const loginUrl = `${apiUrl}/v1/auth/authenticate`
const userUrl = `${apiUrl}/usuarios/usuario`
const updateUserUrl = `${apiUrl}/usuarios/`

const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null
}

export const registerUser = createAsyncThunk('auth/register', async(userData) => {
    const { data } = await requester.post(registerUrl, userData)
    return data
});

export const loginUser = createAsyncThunk('auth/login', async(userCredentials) => {
    const { data } = await requester.post(loginUrl, userCredentials)
    return data
});

export const fetchUser = createAsyncThunk('auth/user', async() => {
    const { data } = await requester.get(userUrl)
    return data
})

export const logoutAndClear = () => (dispatch) => {
  dispatch({ type: PURGE })
  dispatch(logout())
}

export const updateUser = createAsyncThunk('auth/updateUser', async(updatedUser) => {
    console.log(updatedUser)
    if (updatedUser) {
        const { data } = await requester.put(updateUserUrl + updatedUser.id, updatedUser.payload);
        return data;
    }    
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
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
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error?.message;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.token = action.payload.accessToken;;
        })
        .addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error?.message;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(updateUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error?.message;
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
    }
})
export const { logout } = authSlice.actions;
export default authSlice.reducer;