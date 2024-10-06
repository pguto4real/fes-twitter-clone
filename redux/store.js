import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "./modalSlice";
import userSlice from "./userSlice";

import userProfileSlice from "./userProfileSlice";
import { postsApi } from "./postsApi";
import { usersApi } from "./usersApi";

export const store = configureStore({
  reducer: {
    modals: modalSlice,
    user: userSlice,
    userProfile: userProfileSlice,
    [postsApi.reducerPath]: postsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postsApi.middleware, usersApi.middleware),
});
