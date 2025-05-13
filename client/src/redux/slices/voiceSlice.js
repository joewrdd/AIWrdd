import { createSlice } from "@reduxjs/toolkit";
import { generateContent } from "./contentSlice";

//----- Initial State -----//
const initialState = {
  transcript: "",
  isListening: false,
  speechSupported: true,
  error: null,
};

//----- Voice Slice -----//
const voiceSlice = createSlice({
  name: "voice",
  initialState,
  reducers: {
    setTranscript: (state, action) => {
      state.transcript = action.payload;
    },
    appendTranscript: (state, action) => {
      state.transcript = state.transcript + " " + action.payload;
    },
    clearTranscript: (state) => {
      state.transcript = "";
    },
    setIsListening: (state, action) => {
      state.isListening = action.payload;
    },
    setSpeechSupported: (state, action) => {
      state.speechSupported = action.payload;
    },
    setVoiceError: (state, action) => {
      state.error = action.payload;
    },
    clearVoiceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generateContent.pending, (state) => {
      state.error = null;
    });
  },
});

//----- Voice Slice Actions -----//
export const {
  setTranscript,
  appendTranscript,
  clearTranscript,
  setIsListening,
  setSpeechSupported,
  setVoiceError,
  clearVoiceError,
} = voiceSlice.actions;

//----- Voice Slice Selectors -----//
export const selectTranscript = (state) => state.voice.transcript;
export const selectIsListening = (state) => state.voice.isListening;
export const selectSpeechSupported = (state) => state.voice.speechSupported;
export const selectVoiceError = (state) => state.voice.error;

//----- Voice Slice Reducer -----//
export default voiceSlice.reducer;
