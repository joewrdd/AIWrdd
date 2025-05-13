import { createSlice } from "@reduxjs/toolkit";

//----- Initial State -----//
const initialState = {
  modals: {
    viewContent: false,
    editContent: false,
    deleteContent: false,
  },
  selectedContent: null,
  editedContent: "",
  contentToDelete: null,
  mobileMenuOpen: false,
};

//----- UI Slice -----//
export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    setSelectedContent: (state, action) => {
      state.selectedContent = action.payload;
    },
    setEditedContent: (state, action) => {
      state.editedContent = action.payload;
    },
    setContentToDelete: (state, action) => {
      state.contentToDelete = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    resetContentState: (state) => {
      state.selectedContent = null;
      state.editedContent = "";
      state.contentToDelete = null;
      state.modals.viewContent = false;
      state.modals.editContent = false;
      state.modals.deleteContent = false;
    },
  },
});

//----- UI Slice Actions -----//
export const {
  openModal,
  closeModal,
  setSelectedContent,
  setEditedContent,
  setContentToDelete,
  toggleMobileMenu,
  setMobileMenuOpen,
  resetContentState,
} = uiSlice.actions;

//----- UI Slice Selectors -----//
export const selectViewContentModal = (state) => state.ui.modals.viewContent;
export const selectEditContentModal = (state) => state.ui.modals.editContent;
export const selectDeleteContentModal = (state) =>
  state.ui.modals.deleteContent;
export const selectSelectedContent = (state) => state.ui.selectedContent;
export const selectEditedContent = (state) => state.ui.editedContent;
export const selectContentToDelete = (state) => state.ui.contentToDelete;
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen;

//----- UI Slice Reducer -----//
export default uiSlice.reducer;
