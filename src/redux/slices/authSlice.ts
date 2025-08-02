import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "@/api/axios";
import { AuthUser } from "@/types/auth";

// Payload types
interface LoginPayload {
  email: string;
  password: string;
}
interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  user: AuthUser | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

export const fetchCurrentUser = createAsyncThunk<AuthUser, void, { rejectValue: string }>(
  "auth/me",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data.data as AuthUser;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Unable to fetch user session");
    }
  }
);

export const loginUser = createAsyncThunk<AuthUser, LoginPayload, { rejectValue: string }>(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      await thunkAPI.dispatch(fetchCurrentUser()); // Get full user profile after login
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk<AuthUser, RegisterPayload, { rejectValue: string }>(
  "auth/register",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/register", { name, email, password });
      await thunkAPI.dispatch(fetchCurrentUser()); // Optional: fetch user data after registration
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchCurrentUser
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = "failed";
        state.user = null;
      });

    // loginUser
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      });

    // registerUser
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
      });

    // logoutUser
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
