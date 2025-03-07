import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

// Get All Users
export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/users/get-users') // Загружаем всех пользователей
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Error users loading')
    }
})

// Get User Trips
export const fetchTrips = createAsyncThunk('trips/fetchTrips', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/users/get-trips')
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Error trips loading')
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: [],
        trips: [], // ✅ Добавил trips в initialState
        status: 'idle', // idle | loading | succeeded | failed
        error: null,
    },
    extraReducers: (builder) => {
        builder
            // Get All Users
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
                state.error = action.payload
            })

            // Get User Trips
            .addCase(fetchTrips.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchTrips.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.trips = action.payload.trips
            })
            .addCase(fetchTrips.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload // ✅ Добавил вывод ошибки
            })
    },
})

export default userSlice.reducer