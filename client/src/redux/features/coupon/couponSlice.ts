import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

// Асинхронное добавление купона
export const assignCoupon = createAsyncThunk(
  "coupon/assignCoupon",
  async ({ userId, coupon }, { rejectWithValue }) => {
    try {
      const response = await axios.patch("/edit-profile", { userId, coupon });
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        return rejectWithValue("User already has a coupon code");
      }
      return rejectWithValue(
        error.response?.data || "Error coupon code assignment"
      );
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(assignCoupon.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(assignCoupon.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(assignCoupon.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default couponSlice.reducer;
