import { useDispatch, useSelector } from "react-redux";
import {
  requestPasswordReset,
  clearErrors,
} from "../redux/features/password/resetPasswordSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";

export const RequestPasswordReset = () => {
  const { status, message, requestResetError } = useSelector(
    (state) => state.password
  );
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "succeeded" && message) {
      toast.success(message);
      dispatch(clearErrors());
      navigate("/sign-in");
    } else if (status === "failed" && requestResetError) {
      toast.error(requestResetError);
      dispatch(clearErrors());
    }
  }, [status, message, requestResetError]);

  const loading = status === "loading";

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(requestPasswordReset(email));
  };

  return (
    <div className="flex flex-col flex-1 h-screen bg-gradient-primary justify-center px-6 mx-auto lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link to={"/sign-in"} tabIndex={-1}>
          <img
            alt="Jinn community"
            src={logo}
            className="mx-auto h-20 w-auto"
          />
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-100">
          Enter your email to reset the password
        </h2>
      </div>
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          noValidate
          onSubmit={handleSubmit}
          method="POST"
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder="exemple@jinn-travel.com"
                tabIndex={1}
                className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              tabIndex={2}
              className="
                flex w-full justify-center rounded-3xl bg-accent mt-10 px-3 py-1.5 
                text-sm font-semibold text-gray-100 shadow-sm hover:bg-accentDark 
                focus-visible:outline focus-visible:outline-2 
                focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-95 transition-all
                disabled:scale-100 disabled:shadow-inset-2 disabled:bg-accentDark disabled:animate-pulse disabled:cursor-progress"
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
