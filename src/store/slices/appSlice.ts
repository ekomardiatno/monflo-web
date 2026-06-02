import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { fetchSettingsApi, updateSettingsApi } from '@/services/settings.service';
import type { SettingsType } from '@/types';

interface AppState {
  appearanceType: 'LIGHT' | 'DARK';
  amountVisibility: boolean;
  autoSelectAppearance: boolean;
}

const initialState: AppState = {
  appearanceType: 'LIGHT',
  amountVisibility: true,
  autoSelectAppearance: true,
};

export const fetchSettingsThunk = createAsyncThunk(
  'app/fetchSettings',
  async () => fetchSettingsApi(),
);

export const updateSettingsThunk = createAsyncThunk(
  'app/updateSettings',
  async (data: Partial<SettingsType>) => updateSettingsApi(data),
);

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppearanceType: (state, action: PayloadAction<'LIGHT' | 'DARK'>) => {
      state.appearanceType = action.payload;
    },
    setAmountVisible: (state, action: PayloadAction<boolean>) => {
      state.amountVisibility = action.payload;
    },
    setAutoSelectAppearanceType: (state, action: PayloadAction<boolean>) => {
      state.autoSelectAppearance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSettingsThunk.fulfilled, (state, action) => {
      state.appearanceType = action.payload.appearanceType;
      state.amountVisibility = action.payload.amountVisibility;
      state.autoSelectAppearance = action.payload.autoSelectAppearance;
    });
  },
});

export const {
  setAmountVisible,
  setAppearanceType,
  setAutoSelectAppearanceType,
} = appSlice.actions;

export default appSlice.reducer;
