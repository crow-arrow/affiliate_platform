import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

// Upload Avatar
export const uploadAvatar = createAsyncThunk(
  "user/uploadAvatar",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.patch("/uploads/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(fetchUsers());
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error uploading"
      );
    }
  }
);

// Get All Users
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/users/get-users");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error users loading"
      );
    }
  }
);

// Get User Trips
export const fetchTrips = createAsyncThunk(
  "trips/fetchTrips",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/users/:id/trips");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error trips loading"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    currentUser: {
      avatarUrl: "",
    },
    trips: [],
    avatarStatus: "idle", // idle | loading | succeeded | failed
    usersStatus: "idle",
    tripsStatus: "idle",
    avatarError: null,
    usersError: null,
    tripsError: null,
    message: null,
  },
  reducers: {
    resetAvatarStatus: (state) => {
      state.avatarStatus = "idle";
      state.message = null;
      state.avatarError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.avatarStatus = "loading";
        state.avatarError = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.avatarStatus = "succeeded";
        state.currentUser.avatarUrl = action.payload.user.avatarUrl;
        state.message = action.payload.message;
        state.avatarError = null;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.avatarStatus = "failed";
        state.avatarError = action.payload || "Unknown error";
      })

      // Get All Users
      .addCase(fetchUsers.pending, (state) => {
        state.usersStatus = "loading";
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersStatus = "succeeded";
        state.users = action.payload;
        state.usersError = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersStatus = "failed";
        state.usersError = action.payload;
      })

      // Get User Trips
      .addCase(fetchTrips.pending, (state) => {
        state.tripsStatus = "loading";
        state.tripsError = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.tripsStatus = "succeeded";
        state.trips = action.payload.trips;
        state.tripsError = null;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.tripsStatus = "failed";
        state.tripsError = action.payload;
      });
  },
});

export const { resetAvatarStatus } = userSlice.actions;
export default userSlice.reducer;
