import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

export interface User {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  avatarUrl?: string;
  role: "user" | "admin";
}

export interface AuthResponse {
  user?: User;
  token?: string;
  refreshToken?: string;
  message?: string;
  errors?: Array<{ message: string }>;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  errors: Array<{ message: string }>;
  message?: string | null;
}

const initialState: AuthState = {
  user: null,
  token: window.localStorage.getItem("token") || null,
  refreshToken: window.localStorage.getItem("refreshToken") || null,
  isLoading: false,
  status: "idle",
  message: null,
  errors: [],
};

interface RegisterParams {
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  password: string;
}

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterParams,
  { rejectValue: Array<{ message: string }> }
>(
  "auth/registerUser",
  async (
    { email, phone, first_name, last_name, password },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post<AuthResponse>("/auth/sign-up", {
        email,
        phone,
        first_name,
        last_name,
        password,
      });
      if (data.message) return data;
      return rejectWithValue([
        { message: data.message ?? "Registration failed" },
      ]);
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

interface LoginParams {
  email: string;
  password: string;
}

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
    return rejectWithValue([
      { message: data.message || "Missing token in response" },
    ]);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.errors || [
        { message: error.response?.data?.message || "Login failed" },
      ]
    );
  }
});

interface OAuthParams {
  token: string;
}

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
    return rejectWithValue([
      { message: data.message || "No token in response" },
    ]);
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { message: "OAuth failed" });
  }
});

export const getMe = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>("auth/getMe", async (_, { rejectWithValue }) => {
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

    return rejectWithValue(
      error.response?.data?.message || "Failed to refresh token"
    );
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
    },
    clearErrors: (state) => {
      state.errors = [];
      state.message = null;
      state.status = "idle";
    },
    updateUserAvatar: (state, action: PayloadAction<string>) => {
      if (state.user) state.user.avatarUrl = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.message = action.payload.message ?? null;
        state.user = action.payload.user ?? null;
        state.token = action.payload.token ?? null;
        state.refreshToken = action.payload.refreshToken ?? null;
        state.errors = [];
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.errors = (action.payload as any) || [];
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.message = action.payload.message ?? null;
        state.user = action.payload.user ?? null;
        state.token = action.payload.token ?? null;
        state.refreshToken = action.payload.refreshToken ?? null;
        state.errors = [];
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.errors = (action.payload as any) || [];
      })
      // Login with OAuth
      .addCase(loginWithOAuth.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(loginWithOAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.message = action.payload.message ?? null;
        state.user = action.payload.user ?? null;
        state.token = action.payload.token ?? null;
        state.refreshToken = action.payload.refreshToken ?? null;
        state.errors = [];
      })
      .addCase(loginWithOAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.errors = (action.payload as { message: string }[]) ?? [];
      })
      // Check authorization
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.user = action.payload?.user ?? null;
        state.errors = [];
      })
      .addCase(getMe.rejected, (state) => {
        state.isLoading = false;
        state.status = "failed";
        state.user = null;
      })
      // Refresh Token
      .addCase(refreshAccessToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      });
  },
});

export const checkIsAuth = (state: { auth: AuthState }) =>
  Boolean(state.auth.token);

export const checkRole = (state: { auth: AuthState }) => {
  const role = state.auth.user?.role || null;
  return role;
};

export const { clearErrors, logout, updateUserAvatar } = authSlice.actions;

export default authSlice.reducer;
