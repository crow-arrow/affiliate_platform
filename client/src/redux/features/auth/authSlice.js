import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from '../../../utils/axios'

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    status: null,
}

export const registerUser = createAsyncThunk(
    'auth/registerUser', 
    async ({ username, email, firstName, lastName, password }) => {
        try {
            const { data } = await axios.post('/auth/signup', {
                username,
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
            return rejectWithValue(error.response?.data || 'Server error')
        }
    })

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
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
                state.status = action.payload?.message || 'Ошибка регистрации';
            })
    },
})

export default authSlice.reducer