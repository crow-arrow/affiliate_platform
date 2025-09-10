import { useSignIn } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SSOCallback = () => {
  const navigate = useNavigate();
  const { signIn, setActive } = useSignIn();

  useEffect(() => {
    async function completeAuth() {
      try {
        console.log("➡️ SSOCallback mounted");
        const result = await signIn?.handleRedirectCallback();
        console.log("➡️ handleRedirectCallback result:", result);

        if (result?.createdSessionId) {
          await setActive({ session: result.createdSessionId });
          console.log("➡️ Clerk session set:", result.createdSessionId);
          navigate("/my-account");
        } else {
          console.warn("⚠️ No createdSessionId in result");
          navigate("/sign-in");
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        navigate("/sign-in");
      }
    }
    completeAuth();
  }, [signIn, setActive, navigate]);

  return <div>Finishing login...</div>;
};
