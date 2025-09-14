import {
  AuthenticateWithRedirectCallback,
  useUser,
  useAuth,
} from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginWithOAuth,
  checkIsAuth,
} from "../../redux/features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const OAuthCallback = () => {
  const { isSignedIn, user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(checkIsAuth);

  // Чтобы не запускать useEffect несколько раз
  const calledRef = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (calledRef.current) return;
      if (isSignedIn && clerkUser && !isAuth) {
        calledRef.current = true;

        try {
          console.log("✅ Условия выполнены, получаем токен...");
          const token = await getToken(); // правильный способ
          console.log("Raw token:", token);

          if (token) {
            console.log("🚀 Вызываем loginWithOAuth...");
            const result = await dispatch(loginWithOAuth({ token })).unwrap();
            console.log("✅ loginWithOAuth result:", result);
          } else {
            console.error("❌ Токен не получен");
          }
        } catch (e) {
          console.error("❌ Error in OAuth flow:", e);
          toast.error("Authentication failed. Please log in again.");
          navigate("/sign-in");
        }
      } else {
        console.log("⏳ Условия не выполнены");
      }
    };

    run();
  }, [isSignedIn, clerkUser, isAuth, getToken, dispatch, navigate]);

  // Эта страница всегда должна рендерить компонент коллбэка
  return <AuthenticateWithRedirectCallback />;
};
