import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { verifyEmail } from "../../redux/features/verification/emailVerificationSlice.js";
import { toast } from "react-toastify";
import logo from "../../assets/logo.png";
import { CircularProgress } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const EmailVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  const { status, message, error } = useSelector((state) => state.verification);

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [token]);

  useEffect(() => {
    if (status === "succeeded") {
      localStorage.removeItem("email");
      setTimeout(() => navigate("/login"), 2000);
    } else if (status === "failed") {
      toast.error(error || "An error occurred");
    }
  }, [status, message, error]);

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-primary justify-center items-center">
      <Link to="/login">
        <img alt="Jinn community" src={logo} className="mx-auto h-20 w-auto" />
      </Link>
      <div className="flex flex-col bg-gray-100 relative w-1/3 h-1/4 p-8 mt-10 justify-between items-center rounded-xl shadow-custom">
        {status === "loading" ? (
          <div className="flex flex-col items-center justify-between">
            <p className="w-full text-lg text-center">
              <span>Pleace wait till we will confirm your email...</span>
            </p>
            <CircularProgress className="absolute w-80 h-auto top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" />
          </div>
        ) : status === "succeeded" ? (
          <div className="flex flex-col gap-4 items-center justify-between text-green-800">
            <CheckCircleIcon sx={{ fontSize: "3rem" }} />
            <p className="w-full text-2xl text-center">
              <span className="ml-2">{message}</span>
            </p>
          </div>
        ) : status === "failed" ? (
          <div className="flex flex-col gap-4 items-center justify-between text-red-600">
            <ErrorIcon sx={{ fontSize: "3rem" }} />
            <p className="w-full text-2xl text-center">
              <span className="ml-2">{error}</span>
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center justify-between text-red-600">
            <ErrorIcon sx={{ fontSize: "3rem" }} />
            <p className="w-full text-2xl text-center">
              <span className="ml-2">{error}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
