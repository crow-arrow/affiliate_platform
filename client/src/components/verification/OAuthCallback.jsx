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
      if (isSignedIn && clerkUser && !isAuth) {
        try {
          const token = await window.Clerk.session?.getToken();
          if (token) {
            await dispatch(loginWithOAuth(token)).unwrap();
          }
        } catch (e) {
          toast.error("Authentication failed. Please log in again.");
          navigate("/sign-in");
        }
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
