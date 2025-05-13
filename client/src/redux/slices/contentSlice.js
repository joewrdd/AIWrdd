import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { generateContentAPI } from "../../apis/chatAiAPI";
import { updateCreditUsage } from "./userSlice";

//----- Initial State -----//
const initialState = {
  content: null,
  prompt: "",
  tone: "",
  category: "",
  status: "idle",
  loading: false,
  error: null,
};

//----- Generate Content Async Thunk -----//
export const generateContent = createAsyncThunk(
  "content/generate",
  async (promptData, { rejectWithValue, dispatch }) => {
    try {
      const response = await generateContentAPI(promptData);

      dispatch(updateCreditUsage());

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate content"
      );
    }
  }
);

//----- Content Slice -----//
const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setPrompt: (state, action) => {
      state.prompt = action.payload;
    },
    setTone: (state, action) => {
      state.tone = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    clearContent: (state) => {
      state.content = null;
      state.status = "idle";
    },
    clearPrompt: (state) => {
      state.prompt = "";
      state.tone = "";
      state.category = "";
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  //----- Extra Reducers -----//
  extraReducers: (builder) => {
    builder
      .addCase(generateContent.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(generateContent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.content =
          action.payload?.message || action.payload?.content || "";
      })
      .addCase(generateContent.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload || "Failed to generate content";
      });
  },
});

//----- Content Slice Actions -----//
export const {
  setPrompt,
  setTone,
  setCategory,
  clearContent,
  clearPrompt,
  clearError,
} = contentSlice.actions;

//----- Content Slice Selectors -----//
export const selectContent = (state) => state.content.content;
export const selectPrompt = (state) => state.content.prompt;
export const selectTone = (state) => state.content.tone;
export const selectCategory = (state) => state.content.category;
export const selectContentStatus = (state) => state.content.status;
export const selectContentLoading = (state) => state.content.loading;
export const selectContentError = (state) => state.content.error;

//----- Content Slice Reducer -----//
export default contentSlice.reducer;
