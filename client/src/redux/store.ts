import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import userSlice from "./features/users/userSlice";
import tripSlice from "./features/trips/tripSlice";
import clicksSlice from "./features/clicks/clicksSlice";
import resetPasswordSlice from "./features/password/resetPasswordSlice";
import emailVerificationSlice from "./features/verification/emailVerificationSlice";
import adminSettingsSlice from "./features/admin/adminSettingsSlice";
import integrationSlice from "./features/admin/integrationSlice";
import tenantSlice from "./features/tenant/tenantSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    trips: tripSlice,
    clicks: clicksSlice,
    password: resetPasswordSlice,
    verification: emailVerificationSlice,
    adminSettings: adminSettingsSlice,
    integration: integrationSlice,
    tenant: tenantSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type StoreType = typeof store;
