import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '@/types';
import { loginApi, registerApi, googleAuthApi, logoutApi, getMeApi, setPasswordApi, changeNameApi } from '@/services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: !!localStorage.getItem('accessToken'),
  error: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const res = await loginApi(email, password);
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  },
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async ({ email, name, password }: { email: string; name: string; password: string }) => {
    const res = await registerApi(email, name, password);
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  },
);

export const googleAuthThunk = createAsyncThunk(
  'auth/googleAuth',
  async (idToken: string) => {
    const res = await googleAuthApi(idToken);
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  },
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  const rt = localStorage.getItem('refreshToken');
  if (rt) await logoutApi(rt).catch(() => {});
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
});

export const loadUserThunk = createAsyncThunk('auth/loadUser', async () => {
  return getMeApi();
});

export const setPasswordThunk = createAsyncThunk(
  'auth/setPassword',
  async (password: string) => {
    await setPasswordApi(password);
  },
);

export const changeNameThunk = createAsyncThunk(
  'auth/changeName',
  async (name: string) => {
    return changeNameApi(name);
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Login failed';
    });

    // Register
    builder.addCase(registerThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Registration failed';
    });

    // Google Auth
    builder.addCase(googleAuthThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(googleAuthThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(googleAuthThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Google sign-in failed';
    });

    // Logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    });

    // Set password
    builder.addCase(setPasswordThunk.fulfilled, (state) => {
      if (state.user) state.user.hasPassword = true;
    });

    // Change name
    builder.addCase(changeNameThunk.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    // Load user
    builder.addCase(loadUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(loadUserThunk.rejected, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
