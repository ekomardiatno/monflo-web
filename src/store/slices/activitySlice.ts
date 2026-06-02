import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ActivityType } from '@/types';
import {
  fetchActivitiesApi,
  createActivityApi,
  updateActivityApi,
  deleteActivityApi,
  restoreActivitiesApi,
  resetActivitiesApi,
} from '@/services/activity.service';

interface ActivityState {
  activities: ActivityType[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  activities: [],
  loading: false,
  error: null,
};

export const fetchActivitiesThunk = createAsyncThunk(
  'activity/fetchAll',
  async () => fetchActivitiesApi(),
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

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    clearActivities: (state) => {
      state.activities = [];
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

    // Create
    builder.addCase(createActivityThunk.fulfilled, (state, action) => {
      state.activities.push(action.payload);
    });

    // Update
    builder.addCase(updateActivityThunk.fulfilled, (state, action) => {
      state.activities = state.activities.map((a) =>
        a.id === action.payload.id ? action.payload : a,
      );
    });

    // Delete
    builder.addCase(deleteActivityThunk.fulfilled, (state, action) => {
      state.activities = state.activities.filter((a) => a.id !== action.payload);
    });

    // Restore
    builder.addCase(restoreActivitiesThunk.fulfilled, (state, action) => {
      state.activities = action.payload;
    });

    // Reset
    builder.addCase(resetActivitiesThunk.fulfilled, (state) => {
      state.activities = [];
    });
  },
});

export const { clearActivities } = activitySlice.actions;
export default activitySlice.reducer;
