import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../config";
import { logoutAPI, profileAPI } from "../../apis/usersAPI";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  status: "idle",
};

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileAPI();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutAPI();
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to logout"
      );
    }
  }
);

export const fixSubscription = createAsyncThunk(
  "user/fixSubscription",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${config.API_URL}/api/stripe/fix-subscription`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fix subscription"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateCreditUsage: (state) => {
      if (state.user) {
        state.user.apiRequestCount += 1;
        state.user.monthlyRequestCount -= 1;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.user;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload || "Failed to fetch user profile";
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fixSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(fixSubscription.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fixSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setUser,
  clearUser,
  setLoading,
  setError,
  updateCreditUsage,
  clearError,
} = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectUserStatus = (state) => state.user.status;
export const selectUserSubscription = (state) => state.user.user?.subscription;

export const selectCreditAllocation = (state) => {
  const subscription = state.user.user?.subscription;

  if (subscription === "Premium") return 100;
  if (subscription === "Basic") return 50;
  if (subscription === "Trial") return 25;
  return 5; 
};

export const selectCurrentCycleUsedCredits = (state) => {
  const allocation = selectCreditAllocation(state);
  const remaining = state.user.user?.monthlyRequestCount || 0;
  return allocation - remaining;
};

export const selectRemainingCredits = (state) => {
  return state.user.user?.monthlyRequestCount || 0;
};

export const selectUsedCredits = (state) => {
  return state.user.user?.apiRequestCount || 0;
};

export default userSlice.reducer;
