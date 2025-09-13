import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { loginUser, checkIsAuth } from "../../redux/features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const OAuthCallback = () => {
  const { isSignedIn, user: clerkUser } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(checkIsAuth);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (isSignedIn && clerkUser && !isAuth) {
        try {
          const token = await window.Clerk.session?.getToken();
          if (token) {
            await dispatch(
              loginUser({
                viaOAuth: token,
                email: clerkUser?.primaryEmailAddress?.emailAddress,
              })
            ).unwrap();
          }
        } catch (e) {
          toast.error("Authentication failed. Please log in again.");
          navigate("/sign-in");
          setIsLoaded(true);
        } finally {
          setIsLoaded(true);
          navigate("/my-account");
        }
      }
    };
    run();
  }, [isSignedIn, clerkUser, isAuth, dispatch]);

  if (!isLoaded) {
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
