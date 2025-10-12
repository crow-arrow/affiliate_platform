import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { loginWithOAuth } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { toast } from "react-toastify";

export const OAuthDone = () => {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calledRef = useRef(false);
  const { message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoaded || !userId || !sessionId || calledRef.current) return;

    const run = async () => {
      try {
        const token = await getToken({ template: "backend" });
        console.log("✅ Полученный токен:", token);
        if (!token) {
          console.warn("⚠️ Clerk вернул null вместо токена");
          return;
        }
        calledRef.current = true;
        await dispatch(loginWithOAuth({ token }));
        // toast.success(message);
        navigate("/my-account");
      } catch (err) {
        console.error("OAuth login failed. Please try again.", err);
        toast.error(err?.message || "OAuth login failed. Please try again.");
        navigate("/sign-in");
      }
    };
    run();
  }, [message, isLoaded, userId, sessionId, getToken, dispatch, navigate]);

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <Loader2Icon size={40} className="animate-spin mr-2" />
    </div>
  );
};
