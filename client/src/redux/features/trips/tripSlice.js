import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

// WebSocket-соединение
let socket;

export const getAllTrips = createAsyncThunk(
  "trips/getAllTrips",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/trips/get-all-trips");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Error trips loading" }
      );
    }
  }
);

const tripSlice = createSlice({
  name: "trips",
  initialState: {
    trips: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addTour: (state, action) => {
      state.tours = [...state.tours, action.payload];
    },
    setTripsFromWebSocket: (state, action) => {
      state.trips = [...state.trips, action.payload];
    },
    closeWebSocket: (state) => {
      if (state.socket) {
        state.socket.close();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTrips.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllTrips.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trips = action.payload;
      })
      .addCase(getAllTrips.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });
  },
});

// Слушаем WebSocket-сообщения
export const startWebSocketConnection = () => (dispatch) => {
  socket = new WebSocket("ws://your-websocket-server-url");

  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.onmessage = (event) => {
    const newTrip = JSON.parse(event.data); // Примерный формат данных, полученных через WebSocket
    dispatch(setTripsFromWebSocket(newTrip));
  };

  socket.onerror = (error) => {
    console.error("WebSocket error", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
};

export const { addTour, setTripsFromWebSocket, closeWebSocket } =
  tripSlice.actions;

export default tripSlice.reducer;
