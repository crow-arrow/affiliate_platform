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
    console.log("=== OAuthCallback effect ===");
    console.log("isSignedIn:", isSignedIn);
    console.log("clerkUser:", clerkUser);
    console.log("isAuth:", isAuth);

    const run = async () => {
      if (calledRef.current) {
        console.log("⏭️ Уже вызывали, пропускаем");
        return;
      }
      if (isSignedIn && clerkUser && !isAuth) {
        console.log("✅ Условия выполнены, идем за токеном");
        calledRef.current = true;
        try {
          const token = await getToken();
          console.log("Token:", token?.substring(0, 20), "...");
          await dispatch(loginWithOAuth({ token })).unwrap();
          console.log("✅ loginWithOAuth вызван");
        } catch (e) {
          console.error("❌ Ошибка:", e);
        }
      } else {
        console.log("⏳ Условия не выполнены");
      }
    };

    run();
  }, [isSignedIn, clerkUser, isAuth, getToken, dispatch]);

  // Эта страница всегда должна рендерить компонент коллбэка
  return <AuthenticateWithRedirectCallback />;
};
