import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  paymentStatus: "idle",
  errorMessage: null,
  retryCount: 0,
  debugInfo: {},
  selectedPlan: null,
  successMessage: "",
  clientSecret: "",
  isLoading: false,
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    incrementRetryCount: (state) => {
      state.retryCount += 1;
    },
    setRetryCount: (state, action) => {
      state.retryCount = action.payload;
    },
    setDebugInfo: (state, action) => {
      state.debugInfo = action.payload;
    },
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    setClientSecret: (state, action) => {
      state.clientSecret = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    resetPaymentState: (state) => {
      state.paymentStatus = "idle";
      state.errorMessage = null;
      state.retryCount = 0;
      state.debugInfo = {};
      state.successMessage = "";
      state.clientSecret = "";
      state.isLoading = false;
    },
  },
});

export const {
  setPaymentStatus,
  setErrorMessage,
  incrementRetryCount,
  setRetryCount,
  setDebugInfo,
  setSelectedPlan,
  setSuccessMessage,
  setClientSecret,
  setIsLoading,
  resetPaymentState,
} = paymentSlice.actions;

export const selectPaymentStatus = (state) => state.payment.paymentStatus;
export const selectErrorMessage = (state) => state.payment.errorMessage;
export const selectRetryCount = (state) => state.payment.retryCount;
export const selectDebugInfo = (state) => state.payment.debugInfo;
export const selectSelectedPlan = (state) => state.payment.selectedPlan;
export const selectSuccessMessage = (state) => state.payment.successMessage;
export const selectClientSecret = (state) => state.payment.clientSecret;
export const selectIsLoading = (state) => state.payment.isLoading;

export default paymentSlice.reducer;
