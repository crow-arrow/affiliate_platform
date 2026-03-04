import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/axios";

export interface ApiKey {
  id: string;
  apiKey: string;
  name: string | null;
  isActive: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FieldMapping {
  id: string;
  tenantId: string;
  incomingField: string;
  targetField: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailableField {
  value: string;
  label: string;
  type: string;
}

interface IntegrationState {
  apiKeys: ApiKey[];
  fieldMappings: FieldMapping[];
  availableFields: AvailableField[];
  loading: boolean;
  error: string | null;
}

const initialState: IntegrationState = {
  apiKeys: [],
  fieldMappings: [],
  availableFields: [],
  loading: false,
  error: null,
};

// API Keys
export const fetchApiKeys = createAsyncThunk("integration/fetchApiKeys", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("/admin/integration/api-keys");
    return data.apiKeys;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch API keys");
  }
});

export const createApiKey = createAsyncThunk(
  "integration/createApiKey",
  async (payload: { name?: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/admin/integration/api-keys", payload);
      return data.apiKey;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create API key");
    }
  }
);

export const updateApiKey = createAsyncThunk(
  "integration/updateApiKey",
  async (payload: { id: string; name?: string; isActive?: boolean }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/admin/integration/api-keys/${payload.id}`, payload);
      return data.apiKey;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update API key");
    }
  }
);

export const deleteApiKey = createAsyncThunk(
  "integration/deleteApiKey",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/admin/integration/api-keys/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete API key");
    }
  }
);

// Field Mappings
export const fetchFieldMappings = createAsyncThunk(
  "integration/fetchFieldMappings",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/admin/integration/field-mappings");
      return data.mappings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch field mappings");
    }
  }
);

export const fetchAvailableFields = createAsyncThunk(
  "integration/fetchAvailableFields",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/admin/integration/field-mappings/fields");
      return data.fields;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch available fields");
    }
  }
);

export const createFieldMapping = createAsyncThunk(
  "integration/createFieldMapping",
  async (payload: { incomingField: string; targetField: string; description?: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/admin/integration/field-mappings", payload);
      return data.mapping;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create field mapping");
    }
  }
);

export const updateFieldMapping = createAsyncThunk(
  "integration/updateFieldMapping",
  async (
    payload: {
      id: string;
      incomingField?: string;
      targetField?: string;
      description?: string;
      isActive?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.put(`/admin/integration/field-mappings/${payload.id}`, payload);
      return data.mapping;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update field mapping");
    }
  }
);

export const deleteFieldMapping = createAsyncThunk(
  "integration/deleteFieldMapping",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/admin/integration/field-mappings/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete field mapping");
    }
  }
);

const integrationSlice = createSlice({
  name: "integration",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // API Keys
      .addCase(fetchApiKeys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApiKeys.fulfilled, (state, action) => {
        state.loading = false;
        state.apiKeys = action.payload;
      })
      .addCase(fetchApiKeys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createApiKey.fulfilled, (state, action) => {
        state.apiKeys.unshift(action.payload);
      })
      .addCase(updateApiKey.fulfilled, (state, action) => {
        const index = state.apiKeys.findIndex((key) => key.id === action.payload.id);
        if (index !== -1) {
          state.apiKeys[index] = action.payload;
        }
      })
      .addCase(deleteApiKey.fulfilled, (state, action) => {
        state.apiKeys = state.apiKeys.filter((key) => key.id !== action.payload);
      })
      // Field Mappings
      .addCase(fetchFieldMappings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFieldMappings.fulfilled, (state, action) => {
        state.loading = false;
        state.fieldMappings = action.payload;
      })
      .addCase(fetchFieldMappings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAvailableFields.fulfilled, (state, action) => {
        state.availableFields = action.payload;
      })
      .addCase(createFieldMapping.fulfilled, (state, action) => {
        state.fieldMappings.unshift(action.payload);
      })
      .addCase(updateFieldMapping.fulfilled, (state, action) => {
        const index = state.fieldMappings.findIndex((mapping) => mapping.id === action.payload.id);
        if (index !== -1) {
          state.fieldMappings[index] = action.payload;
        }
      })
      .addCase(deleteFieldMapping.fulfilled, (state, action) => {
        state.fieldMappings = state.fieldMappings.filter((mapping) => mapping.id !== action.payload);
      });
  },
});

export const { clearError } = integrationSlice.actions;
export default integrationSlice.reducer;

