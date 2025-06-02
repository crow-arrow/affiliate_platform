import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import couponSlice from "./features/coupon/couponSlice";
import userSlice from "./features/users/userSlice";
import tripSlice from "./features/trips/tripSlice";
import clicksSlice from "./features/clicks/clicksSlice";
import resetPasswordSlice from "./features/password/resetPasswordSlice";
import emailVerificationSlice from "./features/verification/emailVerificationSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    coupon: couponSlice,
    user: userSlice,
    trips: tripSlice,
    clicks: clicksSlice,
    password: resetPasswordSlice,
    verification: emailVerificationSlice,
  },
});
