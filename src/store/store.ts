import { configureStore } from "@reduxjs/toolkit";
import { noLoginApi } from "./api/noLoginApi";

import { signularisApi } from './api/signularisApi'
import { userinfoSlice } from './slices/userinfoSlice'

export const store = configureStore({
  reducer: {
    [signularisApi.reducerPath]: signularisApi.reducer,
    [noLoginApi.reducerPath]: noLoginApi.reducer,
    userinfo: userinfoSlice.reducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(signularisApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch