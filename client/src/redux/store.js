import { configureStore } from '@reduxjs/toolkit'
import authSlice from './features/auth/authSlice'
import couponSlice from "./features/coupon/couponSlice"

export const store = configureStore({
    reducer: {
        auth: authSlice,
        coupon: couponSlice,
    },
})