import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/axios";

export interface Trip {
  id: string;
  travellerAmount?: number;
  bookingDate?: string | null;
  travelDate?: string | null;
  orderStatus?: string;
  totalPrice?: string;
  currency?: string | null;
  couponCode?: string | null;
  affiliateId?: string | null;
  commission?: number;
  levelUsed?: string;
  isCompleted?: boolean;
  isCanceled?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: any;
}

export interface User {
  id: number;
  clerkId?: string | null;
  email: string;
  phone?: string | null;
  first_name: string;
  last_name: string;
  password: string;
  emailVerified: boolean;
  coupon_code?: string | null;
  affiliate_id?: string | null;
  role: "PARTNER" | "ADMIN" | string;
  level: "Bronze" | "Silver" | "Gold";
  levelChangedAt?: string | null;
  booked_trips_count?: number;
  current_year_travellers?: number | null;
  number_of_travellers?: number | null;
  earnings?: number;
  canceled_earnings?: number;
  total_commission?: number;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface UploadAvatarResponse {
  user: { avatarUrl: string };
  message?: string;
}

interface TripsResponse {
  trips: Trip[];
}

interface UserState {
  users: User[];
  currentUser: { avatarUrl: string };
  trips: Trip[];

  avatarStatus: "idle" | "loading" | "succeeded" | "failed";
  usersStatus: "idle" | "loading" | "succeeded" | "failed";
  tripsStatus: "idle" | "loading" | "succeeded" | "failed";

  avatarError: string | null;
  usersError: string | null;
  tripsError: string | null;
  message: string | null;
}

const initialState: UserState = {
  users: [],
  currentUser: { avatarUrl: "" },
  trips: [],

  avatarStatus: "idle",
  usersStatus: "idle",
  tripsStatus: "idle",

  avatarError: null,
  usersError: null,
  tripsError: null,
  message: null,
};

export const uploadAvatar = createAsyncThunk<
  UploadAvatarResponse,
  FormData,
  { rejectValue: string }
>("user/uploadAvatar", async (formData, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await axios.patch<UploadAvatarResponse>("/me/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(fetchUsers());
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Error uploading avatar");
  }
});

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<User[]>("/users/get-users");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error loading users");
    }
  }
);

export const fetchTrips = createAsyncThunk<TripsResponse, void, { rejectValue: string }>(
  "trips/fetchTrips",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<TripsResponse>("/me/trips");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error loading user trips");
    }
  }
);

export const teamTrips = createAsyncThunk<
  TripsResponse,
  string, // userId
  { rejectValue: string }
>("trips/teamTrips", async (userId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<TripsResponse>(`/users/${userId}/trips`);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Error loading team trips");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetAvatarStatus: (state) => {
      state.avatarStatus = "idle";
      state.avatarError = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.avatarStatus = "loading";
        state.avatarError = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action: PayloadAction<UploadAvatarResponse>) => {
        state.avatarStatus = "succeeded";
        state.currentUser.avatarUrl = action.payload.user.avatarUrl;
        state.message = action.payload.message || null;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.avatarStatus = "failed";
        state.avatarError = action.payload ?? "Unknown error";
      })

      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.usersStatus = "loading";
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.usersStatus = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersStatus = "failed";
        state.usersError = action.payload ?? "Unknown error";
      })

      // Fetch My Trips
      .addCase(fetchTrips.pending, (state) => {
        state.tripsStatus = "loading";
        state.tripsError = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action: PayloadAction<TripsResponse>) => {
        state.tripsStatus = "succeeded";
        state.trips = action.payload.trips || [];
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.tripsStatus = "failed";
        state.tripsError = action.payload ?? "Unknown error";
      })

      // Fetch Team Trips
      .addCase(teamTrips.pending, (state) => {
        state.tripsStatus = "loading";
        state.tripsError = null;
      })
      .addCase(teamTrips.fulfilled, (state, action: PayloadAction<TripsResponse>) => {
        state.tripsStatus = "succeeded";
        state.trips = action.payload.trips;
      })
      .addCase(teamTrips.rejected, (state, action) => {
        state.tripsStatus = "failed";
        state.tripsError = action.payload ?? "Unknown error";
      });
  },
});

export const { resetAvatarStatus } = userSlice.actions;
export default userSlice.reducer;
