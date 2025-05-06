import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "../slices/userSlice";
import contentReducer from "../slices/contentSlice";
import voiceReducer from "../slices/voiceSlice";
import uiReducer from "../slices/uiSlice";
import paymentReducer from "../slices/paymentSlice";
import processReducer from "../slices/processSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  user: userReducer,
  content: contentReducer,
  voice: voiceReducer,
  ui: uiReducer,
  payment: paymentReducer,
  process: processReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
