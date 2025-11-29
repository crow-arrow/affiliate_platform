import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/axios";

// Types
export interface LevelSetting {
  id?: number;
  levelName: string;
  levelOrder: number;
  requiredAmount: number;
  isActive: boolean;
}

export interface AppSettings {
  levelAmountDescription: string;
}

export interface LevelSettingsState {
  levelSettings: LevelSetting[];
  appSettings: AppSettings;
  loading: boolean;
  error: string | null;
}

const initialState: LevelSettingsState = {
  levelSettings: [],
  appSettings: {
    levelAmountDescription: "Travellers This Year",
  },
  loading: false,
  error: null,
};

// Async thunks
export const fetchLevelSettings = createAsyncThunk(
  "adminSettings/fetchLevelSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/admin/level-settings/get");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch level settings");
    }
  }
);

export const updateLevelSettings = createAsyncThunk(
  "adminSettings/updateLevelSettings",
  async (
    data: { levelSettings: LevelSetting[]; appSettings: AppSettings },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put("/admin/level-settings/update", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to update level settings");
    }
  }
);

export const createLevel = createAsyncThunk(
  "adminSettings/createLevel",
  async (levelData: Omit<LevelSetting, "id">, { rejectWithValue }) => {
    try {
      const response = await axios.post("/admin/level-settings/levels", levelData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to create level");
    }
  }
);

export const deleteLevel = createAsyncThunk(
  "adminSettings/deleteLevel",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/admin/level-settings/levels/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete level");
    }
  }
);

// Slice
const adminSettingsSlice = createSlice({
  name: "adminSettings",
  initialState,
  reducers: {
    addLevel: (state, action: PayloadAction<LevelSetting>) => {
      state.levelSettings.push(action.payload);
    },
    updateLevel: (state, action: PayloadAction<{ index: number; level: LevelSetting }>) => {
      const { index, level } = action.payload;
      state.levelSettings[index] = level;
    },
    removeLevel: (state, action: PayloadAction<number>) => {
      state.levelSettings.splice(action.payload, 1);
      // Обновляем порядок
      state.levelSettings.forEach((level, index) => {
        level.levelOrder = index + 1;
      });
    },
    updateAppSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.appSettings = { ...state.appSettings, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch level settings
      .addCase(fetchLevelSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLevelSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.levelSettings = action.payload.levelSettings || [];
        state.appSettings = action.payload.appSettings || {
          levelAmountDescription: "Travellers This Year",
        };
      })
      .addCase(fetchLevelSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update level settings
      .addCase(updateLevelSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLevelSettings.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateLevelSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create level
      .addCase(createLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.levelSettings.push(action.payload);
      })
      .addCase(createLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete level
      .addCase(deleteLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.levelSettings = state.levelSettings.filter((level) => level.id !== action.payload);
      })
      .addCase(deleteLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addLevel, updateLevel, removeLevel, updateAppSettings, clearError } =
  adminSettingsSlice.actions;

export default adminSettingsSlice.reducer;
