import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ActivityType, SummaryType } from '@/types';
import {
  fetchActivitiesApi,
  createActivityApi,
  updateActivityApi,
  deleteActivityApi,
  restoreActivitiesApi,
  resetActivitiesApi,
  fetchSummaryApi,
} from '@/services/activity.service';

interface ActivityState {
  activities: ActivityType[];
  summary: SummaryType | null;
  monthlyActivities: Record<string, ActivityType[]>;
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  activities: [],
  summary: null,
  monthlyActivities: {},
  loading: false,
  error: null,
};

// Existing thunks (kept for backward compat — backup uses fetchAll)
export const fetchActivitiesThunk = createAsyncThunk(
  'activity/fetchAll',
  async (params?: { month?: number; year?: number }) =>
    fetchActivitiesApi(params?.month, params?.year),
);

export const createActivityThunk = createAsyncThunk(
  'activity/create',
  async (data: Omit<ActivityType, 'id'>) => createActivityApi(data),
);

export const updateActivityThunk = createAsyncThunk(
  'activity/update',
  async ({ id, data }: { id: number; data: Partial<ActivityType> }) =>
    updateActivityApi(id, data),
);

export const deleteActivityThunk = createAsyncThunk(
  'activity/delete',
  async (id: number) => {
    await deleteActivityApi(id);
    return id;
  },
);

export const restoreActivitiesThunk = createAsyncThunk(
  'activity/restore',
  async (activities: Omit<ActivityType, 'id'>[]) => restoreActivitiesApi(activities),
);

export const resetActivitiesThunk = createAsyncThunk(
  'activity/reset',
  async () => {
    await resetActivitiesApi();
  },
);

// New thunks
export const fetchSummaryThunk = createAsyncThunk(
  'activity/fetchSummary',
  async () => fetchSummaryApi(),
);

export const fetchMonthActivitiesThunk = createAsyncThunk(
  'activity/fetchMonth',
  async ({ month, year }: { month: number; year: number }) =>
    ({ activities: await fetchActivitiesApi(month, year), month, year }),
);

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    clearActivities: (state) => {
      state.activities = [];
      state.summary = null;
      state.monthlyActivities = {};
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder.addCase(fetchActivitiesThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchActivitiesThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.activities = action.payload;
    });
    builder.addCase(fetchActivitiesThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch activities';
    });

    // Fetch summary
    builder.addCase(fetchSummaryThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSummaryThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.summary = action.payload;
    });
    builder.addCase(fetchSummaryThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch summary';
    });

    // Fetch month activities
    builder.addCase(fetchMonthActivitiesThunk.fulfilled, (state, action) => {
      const { activities, month, year } = action.payload;
      const key = `${year}-${String(month).padStart(2, '0')}`;
      state.monthlyActivities[key] = activities;
    });

    // Create
    builder.addCase(createActivityThunk.fulfilled, (state, action) => {
      state.activities.push(action.payload);
      state.summary = null;
      state.monthlyActivities = {};
    });

    // Update
    builder.addCase(updateActivityThunk.fulfilled, (state, action) => {
      state.activities = state.activities.map((a) =>
        a.id === action.payload.id ? action.payload : a,
      );
      state.summary = null;
      state.monthlyActivities = {};
    });

    // Delete
    builder.addCase(deleteActivityThunk.fulfilled, (state, action) => {
      state.activities = state.activities.filter((a) => a.id !== action.payload);
      state.summary = null;
      state.monthlyActivities = {};
    });

    // Restore
    builder.addCase(restoreActivitiesThunk.fulfilled, (state, action) => {
      state.activities = action.payload;
      state.summary = null;
      state.monthlyActivities = {};
    });

    // Reset
    builder.addCase(resetActivitiesThunk.fulfilled, (state) => {
      state.activities = [];
      state.summary = null;
      state.monthlyActivities = {};
    });
  },
});

export const { clearActivities } = activitySlice.actions;
export default activitySlice.reducer;
