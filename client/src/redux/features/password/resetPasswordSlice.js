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

export const checkResetLink = createAsyncThunk(
  "password/checkResetLink",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/password/check-reset-link`, {
        token,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
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
      console.log(error);
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
    requestResetError: null,
    errors: [],
    message: null,
    linkValid: null,
    linkError: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.errors = [];
      state.requestResetError = null;
      state.message = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.status = "loading";
        state.requestResetError = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
        state.requestResetError = null;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.status = "failed";
        state.requestResetError = action.payload;
      })
      .addCase(checkResetLink.pending, (state) => {
        state.linkValid = null;
        state.linkError = null;
      })
      .addCase(checkResetLink.fulfilled, (state, action) => {
        state.linkValid = action.payload.valid;
        state.linkError = null;
      })
      .addCase(checkResetLink.rejected, (state, action) => {
        state.linkValid = false;
        state.linkError =
          action.payload?.message || "An unexpected error occurred";
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
        state.errors = [];
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
        state.errors = [];
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      });
  },
});

export const { clearErrors } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
