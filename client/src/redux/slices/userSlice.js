import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../config";
import { logoutAPI, profileAPI } from "../../apis/usersAPI";

//----- Initial State -----//
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  status: "idle",
  effectiveSubscription: null,
};

//----- Fetch User Profile Async Thunk -----//
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

//----- Logout User Async Thunk -----//
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

//----- Fix Subscription Async Thunk -----//
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

//----- User Slice -----//
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
      state.effectiveSubscription = null;
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
    //----- Update Effective Subscription -----//
    updateEffectiveSubscription: (state) => {
      if (!state.user) return;

      const payments = state.user.payments || [];
      const lastCompletedPayment = payments
        .filter((payment) => payment.status === "completed")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      let subscription = state.user.subscription;

      if (lastCompletedPayment) {
        if (lastCompletedPayment.subscriptionPlan) {
          subscription = lastCompletedPayment.subscriptionPlan;
        } else if (lastCompletedPayment.amount >= 40) {
          subscription = "Premium";
        } else if (lastCompletedPayment.amount >= 20) {
          subscription = "Basic";
        }
      }

      state.effectiveSubscription = subscription;

      if (subscription === "Premium" && state.user.monthlyRequestCount < 100) {
        state.user.monthlyRequestCount = 100;
      } else if (
        subscription === "Basic" &&
        state.user.monthlyRequestCount < 50
      ) {
        state.user.monthlyRequestCount = 50;
      }
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

        //----- Update Effective Subscription -----//
        if (
          state.user &&
          state.user.payments &&
          state.user.payments.length > 0
        ) {
          const payments = state.user.payments;
          const lastCompletedPayment = payments
            .filter((payment) => payment.status === "completed")
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

          if (lastCompletedPayment) {
            let subscription;
            if (lastCompletedPayment.subscriptionPlan) {
              subscription = lastCompletedPayment.subscriptionPlan;
            } else if (lastCompletedPayment.amount >= 40) {
              subscription = "Premium";
            } else if (lastCompletedPayment.amount >= 20) {
              subscription = "Basic";
            }

            if (subscription) {
              state.effectiveSubscription = subscription;

              //----- Update Credit Allocation Based On Effective Subscription -----//
              if (
                subscription === "Premium" &&
                state.user.monthlyRequestCount < 100
              ) {
                state.user.monthlyRequestCount = 100;
              } else if (
                subscription === "Basic" &&
                state.user.monthlyRequestCount < 50
              ) {
                state.user.monthlyRequestCount = 50;
              }
            }
          }
        }
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
        state.effectiveSubscription = null;
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

//----- User Slice Actions -----//
export const {
  setUser,
  clearUser,
  setLoading,
  setError,
  updateCreditUsage,
  clearError,
  updateEffectiveSubscription,
} = userSlice.actions;

//----- User Slice Selectors -----//
export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectUserStatus = (state) => state.user.status;
export const selectEffectiveSubscription = (state) =>
  state.user.effectiveSubscription ||
  (state.user.user ? state.user.user.subscription : null);

export const selectCreditAllocation = (state) => {
  const subscription = selectEffectiveSubscription(state);

  if (subscription === "Premium") return 100;
  if (subscription === "Basic") return 50;
  if (subscription === "Trial") return 25;
  return 0;
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

//----- User Slice Reducer -----//
export default userSlice.reducer;
