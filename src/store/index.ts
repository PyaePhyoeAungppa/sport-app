"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/features/auth/authSlice";
import { playersApi } from "@/features/players/playersApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import teamReducer from "@/features/teams/teamSlice";
import playersReducer from "@/features/players/playersSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  [playersApi.reducerPath]: playersApi.reducer,
  teams: teamReducer,
  players: playersReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "teams"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for Redux Persist
    }).concat(playersApi.middleware),
});
setupListeners(store.dispatch);
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
