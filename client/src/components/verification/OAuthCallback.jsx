import {
  AuthenticateWithRedirectCallback,
  useUser,
  useAuth,
} from "@clerk/clerk-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginWithOAuth } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export const OAuthCallback = () => {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          await dispatch(loginWithOAuth({ token }));
          navigate("/my-account");
        }
      }
    };
    run();
  }, [isSignedIn]);

  return <AuthenticateWithRedirectCallback />;
};
