import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

export const SSOCallback = () => {
  return (
    <AuthenticateWithRedirectCallback signInForceRedirectUrl="/sign-in/oauth-done" />
  );
};
