import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/axios";

export interface TenantInfo {
  id: string;
  name: string;
  slug: string;
}

interface TenantState {
  current?: TenantInfo | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  resolvedOnce: boolean;
}

const initialState: TenantState = {
  current: null,
  status: "idle",
  error: null,
  resolvedOnce: false,
};

export const resolveTenant = createAsyncThunk<
  TenantInfo,
  { slug?: string },
  { rejectValue: string }
>("tenant/resolve", async ({ slug }, { rejectWithValue }) => {
  try {
    const params = slug ? { slug } : undefined;
    const { data } = await axios.get<TenantInfo>("/tenant/resolve-tenant", { params });
    return data;
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || e?.message || "Failed to resolve tenant");
  }
});

// Business (company) signup thunk moved from authSlice to tenantSlice
export interface BusinessRegisterParams {
  companyName: string;
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface AuthResponseLike {
  user?: any;
  token?: string;
  refreshToken?: string;
  message?: string;
  tenant?: TenantInfo;
}

export const businessSignUp = createAsyncThunk<
  AuthResponseLike,
  BusinessRegisterParams,
  { rejectValue: Array<{ message: string }> }
>("tenant/businessSignUp", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<AuthResponseLike>("/tenant/business-sign-up", payload);
    if (data.token) {
      window.localStorage.setItem("token", data.token || "");
      window.localStorage.setItem("refreshToken", data.refreshToken || "");
      return data;
    }
    return rejectWithValue([{ message: data.message || "Business signup failed" }]);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.errors || [
        { message: error.response?.data?.message || "Business signup failed" },
      ]
    );
  }
});

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setTenant(state, action: PayloadAction<TenantInfo | null>) {
      state.current = action.payload;
      state.resolvedOnce = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resolveTenant.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resolveTenant.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
        state.resolvedOnce = true;
      })
      .addCase(resolveTenant.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
        state.resolvedOnce = true;
      });
  },
});

export const { setTenant } = tenantSlice.actions;
export default tenantSlice.reducer;
