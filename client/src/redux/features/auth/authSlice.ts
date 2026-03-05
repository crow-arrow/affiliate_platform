import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import axios, { cancelFailedQueue } from "../../../utils/axios";

export interface User {
  id: string;
  email: string;
  phone: string | null;
  first_name: string;
  last_name: string;
  affiliateId: string;
  avatarUrl?: string;
  role: "PARTNER" | "ADMIN";
  emailVerified: boolean;
  tenantId?: string | null;
  booked_trips_count?: number;
  current_year_travellers?: number;
  total_commission?: number;
  level?: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  createdAt?: string;
  updatedAt?: string;
  hasPassword?: boolean;
}

export interface AuthResponse {
  user?: User;
  token?: string;
  refreshToken?: string;
  message?: string;
  errors?: Array<{ message: string }>;
  tenant?: { id: string; name: string; slug: string };
  currentTenant?: { id: string; name: string; domain: string } | null;
  tenants?: Array<{ id: string; name: string; domain: string }>;
  availableTenants?: Array<{ id: string; name: string; domain: string }>;
  redirectTo?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  avatarStatus: "idle" | "loading" | "succeeded" | "failed";
  isLoading: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  errors: Array<{ message: string }>;
  message?: string | null;
}

const initialState: AuthState = {
  user: null,
  token: window.localStorage.getItem("token") || null,
  refreshToken: window.localStorage.getItem("refreshToken") || null,
  avatarStatus: "idle",
  isLoading: false,
  status: "idle",
  message: null,
  errors: [],
};

interface RegisterParams {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

interface OAuthParams {
  token: string;
}

interface UpdateProfileParams {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  email?: string;
}

export interface UploadAvatarResponse {
  user: { avatarUrl: string };
  message?: string;
}

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterParams,
  { rejectValue: Array<{ message: string }> }
>(
  "auth/registerUser",
  async ({ email, phone, firstName, lastName, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<AuthResponse>("/auth/sign-up", {
        email,
        phone,
        first_name: firstName,
        last_name: lastName,
        password,
      });
      if (data.message) return data;
      return rejectWithValue([{ message: data.message ?? "Registration failed" }]);
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

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginParams,
  { rejectValue: Array<{ message: string }> }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<AuthResponse>("/auth/sign-in", {
      email,
      password,
    });

    if (data.token) {
      window.localStorage.setItem("token", data.token);
      window.localStorage.setItem("refreshToken", data.refreshToken ?? "");
      return data;
    }
    return rejectWithValue([{ message: data.message || "Missing token in response" }]);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.errors || [{ message: error.response?.data?.message || "Login failed" }]
    );
  }
});

export const loginWithOAuth = createAsyncThunk<
  AuthResponse,
  OAuthParams,
  { rejectValue: Array<{ message: string }> }
>("auth/loginWithOAuth", async ({ token }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<AuthResponse>(
      "/auth/oauth-login",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken ?? "");
      return {
        token: data.token,
        refreshToken: data.refreshToken,
        user: data.user,
        message: data.message,
      };
    }
    return rejectWithValue([{ message: data.message || "No token in response" }]);
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { message: "OAuth failed" });
  }
});

export const getMe = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<AuthResponse>("/auth/me");
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          "The service is temporarily unavailable. Please try again later"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk<
  AuthResponse,
  UpdateProfileParams,
  { rejectValue: Array<{ message: string }> }
>("auth/updateUserProfile", async (profileData, { rejectWithValue }) => {
  try {
    const { data } = await axios.patch<AuthResponse>("/me/update-profile", profileData);
    if (data.user) {
      return data;
    }
    return rejectWithValue([{ message: data.message || "Profile update failed" }]);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.errors || [
        { message: error.response?.data?.message || "Profile update failed" },
      ]
    );
  }
});

export const uploadAvatar = createAsyncThunk<
  UploadAvatarResponse,
  FormData,
  { rejectValue: string }
>("auth/uploadAvatar", async (formData, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await axios.patch<UploadAvatarResponse>("/me/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Error uploading avatar");
  }
});

export const deleteAvatar = createAsyncThunk<
  { message: string; user: { avatarUrl: string | null } },
  void,
  { rejectValue: string }
>("auth/deleteAvatar", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete<{ message: string; user: { avatarUrl: string | null } }>(
      "/me/avatar"
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete avatar");
  }
});

export const refreshAccessToken = createAsyncThunk<
  { token: string; refreshToken: string },
  void,
  { rejectValue: string }
>("auth/refreshAccessToken", async (_, { rejectWithValue }) => {
  try {
    const refreshToken = window.localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const { data } = await axios.post("/auth/refresh-token", {
      refreshToken,
    });

    window.localStorage.setItem("token", data.token);
    window.localStorage.setItem("refreshToken", data.refreshToken);

    return {
      token: data.token,
      refreshToken: data.refreshToken,
    };
  } catch (error: any) {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("refreshToken");

    return rejectWithValue(error.response?.data?.message || "Failed to refresh token");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isLoading = false;
      state.status = "idle";
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("refreshToken");

      cancelFailedQueue();
    },
    clearErrors: (state) => {
      state.errors = [];
      state.message = null;
      state.status = "idle";
    },
    updateUserAvatar: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.avatarUrl = action.payload;
    },
    resetAvatarStatus: (state) => {
      state.avatarStatus = "idle";
      state.errors = [];
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user ?? null;
        state.token = action.payload.token ?? null;
        state.refreshToken = action.payload.refreshToken ?? null;
        state.message = action.payload.message ?? null;
        state.errors = [];
        // НЕ сохраняем токен в localStorage при регистрации, так как email еще не верифицирован
        // Токен будет сохранен после успешной верификации OTP
        // Это предотвращает автоматические редиректы до верификации email
      })
      // Login
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user ?? null;
        state.token = action.payload.token ?? null;
        state.refreshToken = action.payload.refreshToken ?? null;
        state.message = action.payload.message ?? null;
        state.errors = [];
      })
      // Login with OAuth
      .addCase(loginWithOAuth.fulfilled, (state, action) => {
        state.message = action.payload.message ?? null;
        state.user = action.payload.user ?? null;
        state.token = action.payload.token ?? null;
        state.refreshToken = action.payload.refreshToken ?? null;
        state.errors = [];
      })
      // Check authorization
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload?.user ?? null;
        state.errors = [];
      })
      // Update User Profile (мержим с текущим user, чтобы не потерять avatarUrl и др. поля, которых нет в ответе)
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        const payloadUser = action.payload?.user;
        if (payloadUser) {
          state.user = state.user ? { ...state.user, ...payloadUser } : payloadUser;
        }
        state.message = action.payload?.message ?? null;
        state.errors = [];
      })
      // Upload Avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.avatarStatus = "loading";
        state.errors = [];
      })
      .addCase(uploadAvatar.fulfilled, (state, action: PayloadAction<UploadAvatarResponse>) => {
        state.avatarStatus = "succeeded";
        state.message = action.payload.message || null;
        const newAvatarUrl = action.payload?.user?.avatarUrl;
        if (state.user != null && newAvatarUrl != null) {
          state.user.avatarUrl = newAvatarUrl;
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.avatarStatus = "failed";
        state.errors = [];
      })
      // Delete Avatar
      .addCase(deleteAvatar.pending, (state) => {
        state.avatarStatus = "loading";
        state.errors = [];
      })
      .addCase(deleteAvatar.fulfilled, (state, action) => {
        if (state.user != null && action.payload?.user) {
          state.user.avatarUrl = action.payload.user.avatarUrl ?? undefined;
        }
        state.message = action.payload?.message ?? null;
      })
      .addCase(deleteAvatar.rejected, (state, action) => {
        state.avatarStatus = "failed";
        state.errors = [];
      })
      // Refresh Token
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      // All pending actions matchers
      .addMatcher(isPending, (state) => {
        state.isLoading = true;
        state.status = "loading";
        state.errors = [];
      })
      // All fulfilled actions matchers
      .addMatcher(isFulfilled, (state) => {
        state.isLoading = false;
        state.status = "succeeded";
      })
      // All rejected actions matchers
      .addMatcher(isRejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.errors = (action.payload as Array<{ message: string }>) ?? [];
      });
  },
});

export const checkIsAuth = (state: { auth: AuthState }) => Boolean(state.auth.token);

export const checkRole = (state: { auth: AuthState }) => {
  const role = state.auth.user?.role || null;
  return role;
};

export const { clearErrors, logout, updateUserAvatar, resetAvatarStatus } = authSlice.actions;

export default authSlice.reducer;
