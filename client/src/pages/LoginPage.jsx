import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  checkIsAuth,
  clearErrors,
} from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";

export const LoginPage = () => {
  console.log("LoginPage rendered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { status, user, message, errors } = useSelector((state) => state.auth);
  const isAuth = useSelector(checkIsAuth);
  const role = user?.role;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "succeeded") toast(message);

    if (isAuth && user) {
      if (role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/my-account");
      }
    }
  }, [status, message, errors, isAuth, user, role, navigate]);

  const loading = status === "loading";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      setEmail("");
      setPassword("");
    } catch (errors) {
      if (errors && Array.isArray(errors) && errors.length > 0) {
        toast.error(errors[0].message || "Server error");
        dispatch(clearErrors());
      }
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-primary flex-1 flex-col justify-center p-6 m-auto lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Jinn comunity" src={logo} className="mx-auto h-20 w-auto" />
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-100">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form noValidate onSubmit={handleSubmit} className="space-y-6">
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
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="exemple@jinn-travel.com"
                tabIndex={1}
                className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-800 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  to={"/request-reset"}
                  className="font-semibold text-accent hover:text-accentDark transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="*********"
                autoComplete="current-password"
                tabIndex={2}
                className="block w-full rounded-3xl shadow-inset-2 bg-white px-3 py-1.5 text-base text-gray-800 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              tabIndex={3}
              className="flex w-full justify-center rounded-full bg-accent mt-10 px-3 py-1.5 
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
                "Log in"
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm/6 text-gray-100">
          Not a member?{" "}
          <Link
            to="/signup"
            className="font-semibold text-accent hover:text-accentDark transition-colors"
          >
            SignUp now
          </Link>
        </p>
      </div>
    </div>
  );
};
