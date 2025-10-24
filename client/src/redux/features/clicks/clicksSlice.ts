import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

export interface Click {
  id: number;
  affiliate_id: string;
  referer: string | null;
  ip_address: string | null;
  user_agent: string | null;
  timestamp: string;
  referral_user_id: number;
  type: string | null;
  device_type: string | null;
}

interface ClicksResponse {
  clicks: Click[];
}

interface ClicksState {
  clicks: Click[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  message: string | null;
}

const initialState: ClicksState = {
  clicks: [],
  status: "idle",
  error: null,
  message: null,
};

export const fetchClicks = createAsyncThunk<
  ClicksResponse,
  string | undefined,
  { rejectValue: string }
>("clicks/fetchClicks", async (userId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<ClicksResponse>("/me/clicks");
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Error loading clicks"
    );
  }
});

const clicksSlice = createSlice({
  name: "clicks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClicks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchClicks.fulfilled,
        (state, action: PayloadAction<ClicksResponse>) => {
          state.status = "succeeded";
          state.clicks = action.payload.clicks;
          state.error = null;
        }
      )
      .addCase(fetchClicks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export default clicksSlice.reducer;
