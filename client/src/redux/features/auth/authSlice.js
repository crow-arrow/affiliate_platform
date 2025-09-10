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
  async ({ email, password, viaOAuth }, { rejectWithValue }) => {
    try {
      console.log("loginUser payload:", { email, viaOAuth });
      let response;

      if (viaOAuth) {
        response = await axios.post("/auth/oauth-login", null, {
          headers: { Authorization: `Bearer ${viaOAuth}` },
        });
      } else {
        response = await axios.post("/auth/sign-in", { email, password });
      }

      const { data } = response;

      console.log("LOGIN RESPONSE DATA:", email);

      if (data.token) {
        window.localStorage.setItem("token", data.token);
        return { user: data.user, token: data.token, message: data.message };
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

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/auth/me");
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

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    status: "idle",
    errors: [],
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.status = null;
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
        state.errors = [];
      })
      .addCase(loginUser.rejected, (state, action) => {
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
        state.message = action.payload.message;
        state.user = action.payload?.user;
        state.token = action.payload?.token;
        state.errors = [];
      })
      .addCase(getMe.rejected, (state) => {
        state.isLoading = false;
        state.status = "failed";
        state.user = null;
        state.token = null;
        window.localStorage.removeItem("token");
      })
      .addCase("@init", (state) => {
        const token = window.localStorage.getItem("token");
        if (token) {
          state.token = token;
        }
      });
  },
});

export const checkIsAuth = (state) => Boolean(state.auth.token);

export const checkRole = (state) => {
  const role = state.auth.user?.role;
  return role;
};

export const { clearErrors } = authSlice.actions;
export const { logout } = authSlice.actions;

export default authSlice.reducer;
