import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import partypalaceReducer from "./features/partypalaceSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    partypalace: partypalaceReducer,
  },
});
