import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from '../../../utils/axios'

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    status: '',
}


export const registerUser = createAsyncThunk(
    'auth/registerUser', 
    async ({ email, firstName, lastName, password }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/auth/signup', {
                email,
                firstName,
                lastName, 
                password,
            })
            if (data.token) {
                window.localStorage.setItem('token', data.token)

                return data
            }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.response?.data || 'The service is temporarily unavailable. Please try again later'
            )
        }
    }
)

export const loginUser = createAsyncThunk(
    'auth/loginUser', 
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/auth/login', {
                username, 
                password,
            })
            if (data.token) {
                window.localStorage.setItem('token', data.token)
                return { user: data.user, token: data.token }
            }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.response?.data || 'The service is temporarily unavailable. Please try again later'
            )
        }
    }
)

export const getMe = createAsyncThunk('auth/getMe', async () => {
    try {
        const { data } = await axios.get('/auth/me')
            return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || error.response?.data || 'The service is temporarily unavailable. Please try again later'
        )
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            state.isLoading = false
            state.status = ''
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
                state.status = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.status = action.payload.message
                state.user = action.payload.user
                state.token = action.payload.token
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false
                state.status = action.payload
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.status = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.status = action.payload.message
                state.user = action.payload.user
                state.token = action.payload.token
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.status = action.payload.message
            })
            // Check authorization
            .addCase(getMe.pending, (state) => {
                state.isLoading = true
                state.status = null
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isLoading = false
                state.status = null
                state.user = action.payload?.user
                state.token = action.payload?.token
            })
            .addCase(getMe.rejected, (state, action) => {
                state.isLoading = false
                state.status = action.payload
                state.user = null
                state.token = null
                window.localStorage.removeItem('token') // Удаляем токен при ошибке
            })
            .addCase('@init', (state) => {
                const token = window.localStorage.getItem('token')
                if (token) {
                    state.token = token
                }
            })
    },
})

export const checkIsAuth = (state) => Boolean(state.auth.token)

export const checkRole = (state) => {
    const role = state.auth.user?.role
    return role
}

export const {logout} = authSlice.actions

export default authSlice.reducer