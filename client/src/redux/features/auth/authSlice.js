import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    { email, phone, first_name, last_name, password },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post("/auth/sign-up", {
        email,
        phone,
        first_name,
        last_name,
        password,
      });
      if (data.message) {
        return data;
      }
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

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/sign-in", { email, password });

      const { data } = response;

      if (data.token) {
        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("refreshToken", data.refreshToken);
        return {
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
          message: data.message,
        };
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || [
          { message: error.response?.data?.message },
        ]
      );
    }
  }
);

export const loginWithOAuth = createAsyncThunk(
  "auth/loginWithOAuth",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/auth/oauth-login",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { data } = response;
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        return {
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
          message: data.message,
        };
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "OAuth failed" }
      );
    }
  }
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/auth/me");
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          "The service is temporarily unavailable. Please try again later"
      );
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
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
    } catch (error) {
      // Если refresh token невалиден, очищаем все токены
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("refreshToken");

      return rejectWithValue(
        error.response?.data?.message || "Failed to refresh token"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: window.localStorage.getItem("token") || null,
    refreshToken: window.localStorage.getItem("refreshToken") || null,
    isLoading: false,
    status: "idle",
    errors: [],
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isLoading = false;
      state.status = null;
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("refreshToken");
    },
    clearErrors: (state) => {
      state.errors = [];
      state.message = null;
      state.status = "idle";
    },
    updateUserAvatar: (state, action) => {
      if (state.user) {
        state.user.avatarUrl = action.payload;
      }
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
        state.message = action.payload.message;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.errors = [];
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.errors = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.message = action.payload.message;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.errors = [];
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.errors = action.payload;
      })
      // Login with OAuth
      .addCase(loginWithOAuth.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(loginWithOAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.message = action.payload.message;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.errors = [];
      })
      .addCase(loginWithOAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.errors = action.payload;
      })
      // Check authorization
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.user = action.payload?.user;
        state.errors = [];
        // getMe больше не возвращает токены, используем существующие
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

export const checkIsAuth = (state) => Boolean(state.auth.token);

export const checkRole = (state) => {
  const role = state.auth.user?.role;
  return role;
};

export const { clearErrors, logout, updateUserAvatar } = authSlice.actions;

export default authSlice.reducer;
