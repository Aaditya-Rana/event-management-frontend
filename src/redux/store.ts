import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import eventReducer from "./slices/eventSlice";
import bookingReducer from "./slices/bookingSlice";
import categoryReducer from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    booking: bookingReducer,
    category: categoryReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
