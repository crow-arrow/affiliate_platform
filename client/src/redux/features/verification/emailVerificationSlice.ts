import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

export const verifyOTPCode = createAsyncThunk(
  "verification/verifyOTPCode",
  async ({ email, code }: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/auth/verify-otp", { email, code });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Invalid verification code");
    }
  }
);

export const resendOTPCode = createAsyncThunk(
  "verification/resendOTPCode",
  async (email: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/auth/send-otp", { email });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to resend verification code");
    }
  }
);

const emailVerificationSlice = createSlice({
  name: "verification",
  initialState: {
    status: "idle",
    message: "",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // OTP верификация
      .addCase(verifyOTPCode.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyOTPCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(verifyOTPCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Повторная отправка OTP
      .addCase(resendOTPCode.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resendOTPCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(resendOTPCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default emailVerificationSlice.reducer;
