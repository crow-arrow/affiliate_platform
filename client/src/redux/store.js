import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import couponSlice from "./features/coupon/couponSlice";
import userSlice from "./features/users/userSlice";
import tripSlice from "./features/trips/tripSlice";
import resetPasswordSlice from "./features/password/resetPasswordSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    coupon: couponSlice,
    user: userSlice,
    trips: tripSlice,
    password: resetPasswordSlice,
  },
});
