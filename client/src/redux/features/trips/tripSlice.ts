import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

// Типы
export interface Trip {
  id: string;
  name: string;
  date: string;
  location: string;
  [key: string]: any; // можно заменить на конкретные поля, если есть точная структура
}

interface TripsState {
  trips: Trip[];
  status: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  error: string | null;
}

const initialState: TripsState = {
  trips: [],
  status: "idle",
  isLoading: false,
  error: null,
};

// ===== Async Thunks =====

export const getAllTrips = createAsyncThunk<
  Trip[],
  void,
  { rejectValue: string }
>("trips/getAllTrips", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<Trip[]>("/trips/get-all-trips");
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Ошибка при загрузке поездок"
    );
  }
});

// ===== WebSocket =====

let socket: WebSocket | null = null;

export const startWebSocketConnection = () => (dispatch: any) => {
  socket = new WebSocket("ws://your-websocket-server-url");

  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.onmessage = (event) => {
    try {
      const newTrip: Trip = JSON.parse(event.data);
      dispatch(addTripFromSocket(newTrip));
    } catch (error) {
      console.error("Ошибка обработки WebSocket-сообщения", error);
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
};

export const closeWebSocketConnection = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

// ===== Slice =====

const tripSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    addTripFromSocket: (state, action: PayloadAction<Trip>) => {
      state.trips.push(action.payload);
    },
    clearTrips: (state) => {
      state.trips = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getAllTrips.fulfilled,
        (state, action: PayloadAction<Trip[]>) => {
          state.trips = action.payload;
          state.error = null;
        }
      )
      .addMatcher(isPending, (state) => {
        state.isLoading = true;
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(isFulfilled, (state) => {
        state.isLoading = false;
        state.status = "succeeded";
      })
      .addMatcher(isRejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = (action.payload as string) ?? "Unknown error";
      });
  },
});

export const { addTripFromSocket, clearTrips } = tripSlice.actions;
export default tripSlice.reducer;
