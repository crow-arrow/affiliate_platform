import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2Icon } from "lucide-react";

export const SSOCallback = () => {
  const { handleRedirectCallback } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        await handleRedirectCallback();
        toast.success("SSO login successful!");
        navigate("/oauth-done");
      } catch (err) {
        console.error("SSO login failed. Please try again:", err);
        // toast.error("SSO login failed. Please try again.");
        navigate("/sign-in");
      }
    };

    run();
  }, [handleRedirectCallback, navigate]);

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <Loader2Icon size={40} className="animate-spin mr-2" />
    </div>
  );
};
