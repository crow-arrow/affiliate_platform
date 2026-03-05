import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

export interface RequestResetResponse {
  message: string;
}

export interface VerifyOtpResponse {
  valid: boolean;
  token: string;
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const changePassword = createAsyncThunk<
  ResetPasswordResponse,
  ChangePasswordPayload,
  { rejectValue: string }
>("password/changeOwn", async ({ currentPassword, newPassword }, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch<ResetPasswordResponse>("/me/change-password", {
      currentPassword,
      newPassword,
    });
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to change password");
  }
});

export const setPassword = createAsyncThunk<
  ResetPasswordResponse,
  { newPassword: string },
  { rejectValue: string }
>("password/setPassword", async ({ newPassword }, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch<ResetPasswordResponse>("/me/set-password", {
      newPassword,
    });
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to set password");
  }
});

export interface PasswordState {
  user: any | null;
  token: string | null;
  resetToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  requestResetError: string | null;
  errors: Array<{ message: string }>;
  message: string | null;
  linkValid: boolean | null;
  linkError: string | null;
  resetCompleted: boolean; // флаг успешного сброса пароля
}

export const requestPasswordReset = createAsyncThunk<
  RequestResetResponse,
  string,
  { rejectValue: string }
>("password/requestReset", async (email, { rejectWithValue }) => {
  try {
    const { data } = await axios.post("/password/request-reset", { email });
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Error");
  }
});

export const verifyPasswordResetOTP = createAsyncThunk<
  VerifyOtpResponse,
  { email: string; code: string },
  { rejectValue: string }
>("password/verifyOTP", async ({ email, code }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post("/password/verify-otp", {
      email,
      code,
    });
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Invalid code");
  }
});

export const resetPassword = createAsyncThunk<
  ResetPasswordResponse,
  { token: string; newPassword: string; confirmPassword: string },
  { rejectValue: Array<{ message: string }> }
>(
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

const initialState: PasswordState = {
  user: null,
  token: null,
  resetToken: null,
  status: "idle",
  requestResetError: null,
  errors: [],
  message: null,
  linkValid: null,
  linkError: null,
  resetCompleted: false,
};

const resetPasswordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.errors = [];
      state.requestResetError = null;
      state.message = null;
      state.status = "idle";
      state.resetCompleted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.status = "loading";
        state.requestResetError = null;
      })
      .addCase(
        requestPasswordReset.fulfilled,
        (state, action: PayloadAction<RequestResetResponse>) => {
          state.status = "succeeded";
          state.message = action.payload.message;
          state.requestResetError = null;
          state.resetCompleted = false;
        }
      )
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.status = "failed";
        state.requestResetError = action.payload as string;
      })
      // Верификация OTP для восстановления пароля
      .addCase(verifyPasswordResetOTP.pending, (state) => {
        state.status = "loading";
        state.requestResetError = null;
      })
      .addCase(
        verifyPasswordResetOTP.fulfilled,
        (state, action: PayloadAction<VerifyOtpResponse>) => {
          state.status = "succeeded";
          state.resetToken = action.payload.token;
          state.linkValid = action.payload.valid;
          state.message = action.payload.message;
          state.requestResetError = null;
          state.resetCompleted = false;
        }
      )
      .addCase(verifyPasswordResetOTP.rejected, (state, action) => {
        state.status = "failed";
        state.requestResetError = action.payload as string;
        state.linkValid = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
        state.errors = [];
      })
      .addCase(resetPassword.fulfilled, (state, action: PayloadAction<ResetPasswordResponse>) => {
        state.status = "succeeded";
        state.message = action.payload.message;
        state.errors = [];
        state.resetCompleted = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload as Array<{ message: string }>;
        state.resetCompleted = false;
      })
      // Change password for authenticated user
      .addCase(changePassword.pending, (state) => {
        state.status = "loading";
        state.message = null;
      })
      .addCase(changePassword.fulfilled, (state, action: PayloadAction<ResetPasswordResponse>) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload as string;
      })
      .addCase(setPassword.pending, (state) => {
        state.status = "loading";
        state.message = null;
      })
      .addCase(setPassword.fulfilled, (state, action: PayloadAction<ResetPasswordResponse>) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(setPassword.rejected, (state, action) => {
        state.status = "failed";
        state.message = action.payload as string;
      });
  },
});

export const { clearErrors } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
