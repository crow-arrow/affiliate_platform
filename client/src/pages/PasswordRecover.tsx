import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  resetPassword,
  checkResetLink,
  clearErrors,
} from "../redux/features/password/resetPasswordSlice";
import { toast } from "sonner";
import logo from "../assets/logo.png";
import ErrorIcon from "@mui/icons-material/Error";

export const PasswordRecover = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { linkValid, linkError } = useSelector((state) => state.password);
  const { status, message, errors } = useSelector((state) => state.password);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkResetLink(token));
  }, [token, dispatch]);

  useEffect(() => {
    if (status === "succeeded" && message) {
      toast.success(message);
      navigate("/sign-in");
    }
  }, [status, errors, message, navigate]);

  const loading = status === "loading";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await dispatch(
        resetPassword({
          token,
          newPassword,
          confirmPassword,
        })
      ).unwrap();
      setNewPassword("");
      setConfirmPassword("");
    } catch (errors) {
      if (errors && Array.isArray(errors) && errors.length > 0) {
        toast.error(errors[0].message || "Unknown error");
        dispatch(clearErrors());
      }
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (!linkValid === true) {
    return (
      <div className="flex flex-col w-full h-screen bg-gradient-primary justify-center items-center">
        <Link to="/sign-in">
          <img alt="Jinn community" src={logo} className="mx-auto h-20 w-auto" />
        </Link>
        <div className="flex flex-col bg-gray-100 relative w-1/3 h-1/4 p-8 mt-10 justify-between items-center rounded-xl shadow-custom">
          <div className="flex flex-col gap-4 items-center justify-between text-red-600">
            <ErrorIcon sx={{ fontSize: "3rem" }} />
            <p className="w-full text-2xl text-center">
              <span className="ml-2">{linkError}</span>
            </p>
            <Link
              to="/request-reset"
              // disabled={loading}
              tabIndex={1}
              className="flex w-full justify-center rounded-3xl bg-gradient-primary px-3 py-1.5 
                            text-sm font-semibold text-gray-100 shadow-custom hover:shadow-inset-2
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-950
                            active:scale-90 transition-all"
            >
              Resend the Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-screen bg-gradient-primary justify-center px-6 mx-auto lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Jinn community" src={logo} className="mx-auto h-20 w-auto" />
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-100">Password Recovery</h2>
      </div>
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form noValidate onSubmit={handleSubmit} method="POST" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
              New Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="*********"
                autoComplete="new-password"
                className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="confirm-password"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Confirm new password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="confirm-password"
                name="password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="*********"
                autoComplete="new-password"
                className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="
                                flex w-full justify-center rounded-3xl bg-accent mt-10 px-3 py-1.5
                                text-sm font-semibold text-gray-100 shadow-sm hover:bg-accentDark 
                                focus-visible:outline focus-visible:outline-2 
                                focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-95 transition-all
                                disabled:scale-100 disabled:shadow-inset-2 disabled:bg-saccentDark disabled:animate-pulse disabled:cursor-progress"
            >
              {loading ? (
                <>
                  <span role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="#4f7c82"
                      />
                    </svg>
                    Loading...
                  </span>
                </>
              ) : (
                "Reset"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
