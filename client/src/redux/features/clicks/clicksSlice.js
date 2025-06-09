import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

// Get User Clicks
export const fetchClicks = createAsyncThunk(
  "clicks/fetchClicks",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/users/${userId}/clicks`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error clicks loading"
      );
    }
  }
);

const clicksSlice = createSlice({
  name: "clicks",
  initialState: {
    clicks: [],
    status: "idle",
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get User Clicks
      .addCase(fetchClicks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchClicks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.clicks = action.payload.clicks;
        state.error = null;
      })
      .addCase(fetchClicks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default clicksSlice.reducer;
