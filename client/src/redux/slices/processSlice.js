import { createSlice } from "@reduxjs/toolkit";

//----- Initial State -----//
const initialState = {
  isFixing: false,
  fixStatus: null,
  localError: null,
  authChecked: false,
  statusMessageVisible: true,
  refreshCompleted: false,
};

//----- Process Slice -----//
export const processSlice = createSlice({
  name: "process",
  initialState,
  reducers: {
    setIsFixing: (state, action) => {
      state.isFixing = action.payload;
      if (action.payload) {
        state.statusMessageVisible = true;
      }
    },
    setFixStatus: (state, action) => {
      state.fixStatus = action.payload;
      state.statusMessageVisible = true;
    },
    setLocalError: (state, action) => {
      state.localError = action.payload;
    },
    clearLocalError: (state) => {
      state.localError = null;
    },
    setAuthChecked: (state, action) => {
      state.authChecked = action.payload;
    },
    hideStatusMessage: (state) => {
      state.statusMessageVisible = false;
    },
    setRefreshCompleted: (state, action) => {
      state.refreshCompleted = action.payload;
    },
    resetProcessState: (state) => {
      state.isFixing = false;
      state.fixStatus = null;
      state.localError = null;
      state.statusMessageVisible = true;
      state.refreshCompleted = false;
    },
  },
});

//----- Process Slice Actions -----//
export const {
  setIsFixing,
  setFixStatus,
  setLocalError,
  clearLocalError,
  setAuthChecked,
  hideStatusMessage,
  setRefreshCompleted,
  resetProcessState,
} = processSlice.actions;

//----- Process Slice Selectors -----//
export const selectIsFixing = (state) => state.process.isFixing;
export const selectFixStatus = (state) => state.process.fixStatus;
export const selectLocalError = (state) => state.process.localError;
export const selectAuthChecked = (state) => state.process.authChecked;
export const selectStatusMessageVisible = (state) =>
  state.process.statusMessageVisible;
export const selectRefreshCompleted = (state) => state.process.refreshCompleted;

//----- Process Slice Reducer -----//
export default processSlice.reducer;
