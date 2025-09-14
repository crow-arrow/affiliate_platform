import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { loginWithOAuth } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const OAuthDone = () => {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calledRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !userId || !sessionId || calledRef.current) return;

    const run = async () => {
      try {
        const token = await getToken({ template: "backend" });
        if (!token) {
          console.warn("⚠️ Clerk вернул null вместо токена");
          return;
        }
        calledRef.current = true;
        await dispatch(loginWithOAuth({ token }));
        toast.success("Login successful!");
        navigate("/my-account");
      } catch (err) {
        console.error("❌ Ошибка при loginWithOAuth:", err);
        toast.error("OAuth login failed. Please try again.");
        navigate("/sign-in");
      }
    };
    run();
  }, [isLoaded, userId, sessionId, getToken, dispatch, navigate]);

  return <p>Inicializing sign in …</p>;
};
