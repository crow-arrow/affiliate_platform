import {
  AuthenticateWithRedirectCallback,
  useUser,
  useAuth,
} from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { loginWithOAuth } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const OAuthCallback = () => {
  const { isSignedIn } = useUser();
  const { clerkUser } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // защита от повторных вызовов
  const calledRef = useRef(false);

  console.log("=== OAuthCallback effect ===");
  console.log("isSignedIn:", isSignedIn);
  console.log("clerkUser:", clerkUser);

  useEffect(() => {
    if (!isSignedIn || calledRef.current) return;

    const run = async () => {
      try {
        const token = await getToken();
        console.log("Получен токен:", token);
        if (token) {
          calledRef.current = true;
          console.log("🔥 Перед диспатчем loginWithOAuth", {
            isSignedIn,
            clerkUser,
          });
          await dispatch(loginWithOAuth({ token }));
          toast("Login successful!");
          navigate("/my-account");
        }
      } catch (e) {
        console.error("OAuth error:", e);
        toast.error("OAuth login failed. Please try again.");
      }
    };

    run();
  }, [isSignedIn, getToken, dispatch, navigate]);

  return <AuthenticateWithRedirectCallback />;
};
