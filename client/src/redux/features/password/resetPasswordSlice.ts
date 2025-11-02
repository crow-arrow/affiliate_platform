import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

export const requestPasswordReset = createAsyncThunk(
  "password/requestReset",
  async (email: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/password/request-reset", { email });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error");
    }
  }
);

export const verifyPasswordResetOTP = createAsyncThunk(
  "password/verifyOTP",
  async ({ email, code }: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/password/verify-otp", {
        email,
        code,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Invalid code");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "password/resetPassword",
  async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/password/reset-password", {
        token,
        newPassword,
        confirmPassword,
      });
      return data;
    } catch (error: any) {
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
    resetToken: null, // Токен для сброса пароля после верификации OTP
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
        state.requestResetError = action.payload as string;
      })
      // Верификация OTP для восстановления пароля
      .addCase(verifyPasswordResetOTP.pending, (state) => {
        state.status = "loading";
        state.requestResetError = null;
      })
      .addCase(verifyPasswordResetOTP.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.resetToken = action.payload.token;
        state.linkValid = action.payload.valid;
        state.message = action.payload.message;
        state.requestResetError = null;
      })
      .addCase(verifyPasswordResetOTP.rejected, (state, action) => {
        state.status = "failed";
        state.requestResetError = action.payload as string;
        state.linkValid = false;
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
