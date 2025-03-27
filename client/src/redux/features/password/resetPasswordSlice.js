import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

export const requestPasswordReset = createAsyncThunk(
  "password/requestReset",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/password/request-reset", { email });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "password/resetPassword",
  async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/password/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || [
          {
            message: error.response?.data?.message,
          },
        ]
      );
    }
  }
);

const resetPasswordSlice = createSlice({
  name: "password",
  initialState: {
    user: null,
    token: null,
    status: "idle",
    errors: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.status = "loading";
        state.errors = [];
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
        state.errors = [];
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      });
  },
});

export default resetPasswordSlice.reducer;
