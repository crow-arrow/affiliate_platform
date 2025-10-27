import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useAppDispatch } from "@/redux/hooks";
import { loginWithOAuth } from "@/redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export const OAuthDone = () => {
  const { isLoaded, userId, sessionId, getToken, signOut } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const calledRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || calledRef.current) return;
    calledRef.current = true;

    if (!userId || !sessionId) {
      return;
    }

    const run = async () => {
      try {
        const token = await getToken({ template: "backend" });
        if (!token) {
          console.error("⚠️ No token retrieved");
          return;
        }

        const result = await dispatch(loginWithOAuth({ token })).unwrap();

        toast.success(result.message || "You are signed in!");
        navigate("/");
      } catch (err: any) {
        const msg =
          err?.message ||
          err?.[0]?.message ||
          "SSO sign in failed. Please try again";

        toast.error(msg);
        await signOut();
      }
    };
    run();
  }, [isLoaded, userId, sessionId, getToken, dispatch, navigate, signOut]);

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <Loader2Icon size={40} className="animate-spin mr-2" />
    </div>
  );
};
