import { AuthenticateWithRedirectCallback, useUser } from "@clerk/clerk-react";
import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginWithOAuth,
  checkIsAuth,
} from "../../redux/features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const OAuthCallback = () => {
  const { isSignedIn, user: clerkUser } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(checkIsAuth);
  const { status } = useSelector((state) => state.auth);

  // Когда Clerk закончит редирект, isSignedIn станет true
  useEffect(() => {
    const run = async () => {
      console.log("=== OAuth useEffect ===");
      console.log("isSignedIn:", isSignedIn);
      console.log("clerkUser:", clerkUser);
      console.log("isAuth:", isAuth);

      if (isSignedIn && clerkUser && !isAuth) {
        try {
          console.log("✅ Условия выполнены, получаем токен...");

          const token = await window.Clerk.session?.getToken();
          console.log("Raw token:", token);
          console.log("Token type:", typeof token);
          console.log("Token length:", token?.length);

          if (token) {
            console.log("🚀 Вызываем loginWithOAuth...");
            const result = await dispatch(
              loginWithOAuth({ viaOAuth: token })
            ).unwrap();
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
  }, [isSignedIn, clerkUser, isAuth, dispatch, navigate]);

  useEffect(() => {
    if (status === "succeeded") {
      navigate("/my-account");
    }
  }, [status, navigate]);

  // Показываем прогресс пока Clerk обрабатывает коллбэк
  if (!isSignedIn && !isAuth) {
    return (
      <>
        <AuthenticateWithRedirectCallback />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress size={80} />
        </Box>
      </>
    );
  }

  return null;
};
