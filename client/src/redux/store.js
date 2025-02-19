import { configureStore } from '@reduxjs/toolkit'
import authSlice from './features/auth/authSlice'
import couponSlice from "./features/coupon/couponSlice"
import userReducer from './features/users/userSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        coupon: couponSlice,
        user: userReducer,
    },
})