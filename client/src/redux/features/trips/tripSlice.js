import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from '../../../utils/axios'

// Get All Trips
export const getAllTrips = createAsyncThunk("trips/getAllTrips", async () => {
    try {
        const { data } = await axios.get('/trips/get-all-trips')
        return data
    } catch (error) {
        console.log(error)
    }
})

// Get User Trips
export const fetchTrips = createAsyncThunk( "trips/fetchTrips", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/trips/get-trips')
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Error trips loading' })
    }
})

const tripSlice = createSlice({
    name: 'trips',
    initialState: {
        trips: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get All Trips
            .addCase(getAllTrips.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(getAllTrips.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.trips = action.payload
            })
            .addCase(getAllTrips.rejected, (state) => {
                state.status = 'failed'
            })
            // Get User Trips
            .addCase(fetchTrips.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchTrips.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.trips = action.payload
            })
            .addCase(fetchTrips.rejected, (state) => {
                state.status = 'failed'
            })
    },
})

export default tripSlice.reducer;