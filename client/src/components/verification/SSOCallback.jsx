import { useSignIn } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SSOCallback = () => {
  const navigate = useNavigate();
  const { signIn, setActive } = useSignIn();

  useEffect(() => {
    async function completeAuth() {
      try {
        const result = await signIn?.handleRedirectCallback();
        if (result?.createdSessionId) {
          await setActive({ session: result.createdSessionId });
        }
        navigate("/my-account");
      } catch (err) {
        console.error("OAuth callback error:", err);
        navigate("/sign-in");
      }
    }
    completeAuth();
  }, [signIn, setActive, navigate]);

  return <div>Finishing login...</div>;
};
