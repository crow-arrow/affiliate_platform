import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

// Асинхронный запрос всех пользователей
export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/users') // Загружаем всех пользователей
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Ошибка загрузки пользователей' })
    }
})

const userSlice = createSlice({
    name: 'user', // ✅ Исправлено
    initialState: {
        users: [],
        status: 'idle', // idle | loading | succeeded | failed
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.users = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload?.message || 'Ошибка загрузки пользователей'
            })
    },
})

export default userSlice.reducer