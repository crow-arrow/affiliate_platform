import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export const SSOCallback = () => {
  const { handleRedirectCallback, client } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        await handleRedirectCallback({});

        const signIn = client?.signIn;

        if (!signIn || signIn.status !== "complete") {
          return;
        }

        navigate("/oauth-done");
      } catch (err) {
        console.error("SSO login failed:", err);
        toast.error("SSO sign in failed. Please try again");
      }
    };

    run();
  }, [handleRedirectCallback, navigate, client]);

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <Loader2Icon size={40} className="animate-spin mr-2" />
    </div>
  );
};
