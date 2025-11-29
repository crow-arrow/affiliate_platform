import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

export const verifyEmail = createAsyncThunk(
  "verification/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/auth/verify-email/${token}`);
      if (data.token) {
        return data;
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Something went wrong, please try again later"
      );
    }
  }
);

export const resendEmailVerification = createAsyncThunk(
  "auth/resendEmail",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/resend-email", { email });
      return response.data;
    } catch (error) {
      console.error("Error resending verification email:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Something went wrong, please try again later"
      );
    }
  }
);

const emailVerificationSlice = createSlice({
  name: "verification",
  initialState: {
    status: "idle",
    message: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      })
      .addCase(resendEmailVerification.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resendEmailVerification.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(resendEmailVerification.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });
  },
});

export default emailVerificationSlice.reducer;
