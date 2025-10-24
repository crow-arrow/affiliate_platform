import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { resendEmailVerification } from "../redux/features/verification/emailVerificationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { AnimatedCountdown } from "../components/utils/AnimatedCountdown";
import { toast } from "sonner";

const TIMER_DURATION_SECONDS = 120;
const LOCAL_STORAGE_KEY = "resendEmailTimerEndTime";

export const EmailSentMessage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem("email");

  const { status, message, error } = useSelector((state) => state.verification);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "failed") {
      setTimeout(() => navigate("/sign-in"), 2000);
    }
  }, [status, navigate]);

  useEffect(() => {
    if (location.state?.email) {
      localStorage.setItem("email", location.state.email);
    }
  }, [location.state?.email]);

  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerIntervalRef = useRef(null);

  const restoreTimerFromLocalStorage = () => {
    const storedEndTime = localStorage.getItem(LOCAL_STORAGE_KEY);
    const now = Date.now();

    if (storedEndTime) {
      const endTime = parseInt(storedEndTime, 10);
      const remainingTimeSeconds = Math.max(
        0,
        Math.ceil((endTime - now) / 1000)
      );

      if (remainingTimeSeconds > 0) {
        setCountdown(remainingTimeSeconds);
        startCountdownInterval(remainingTimeSeconds);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setCountdown(0);
      }
    }
  };

  useEffect(() => {
    restoreTimerFromLocalStorage();
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const startCountdownInterval = (initialDuration) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    let currentRemaining = initialDuration;
    timerIntervalRef.current = setInterval(() => {
      currentRemaining -= 1;
      setCountdown(currentRemaining);

      if (currentRemaining <= 0) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setCountdown(0);
      }
    }, 1000);
  };

  const handleClick = async () => {
    if (!email || loading || countdown > 0) return;

    setLoading(true);
    try {
      const result = await dispatch(resendEmailVerification(email));

      if (resendEmailVerification.fulfilled.match(result)) {
        const endTime = Date.now() + TIMER_DURATION_SECONDS * 1000;
        localStorage.setItem(LOCAL_STORAGE_KEY, endTime.toString());
        setCountdown(TIMER_DURATION_SECONDS);
        startCountdownInterval(TIMER_DURATION_SECONDS);
      } else if (resendEmailVerification.rejected.match(result)) {
        toast.error(result.payload || "Something went wrong");
      }
    } catch (err) {
      console.error("Error during resend dispatch:", err);
      toast.error("Unexpected error occurred");
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gradient-primary justify-center items-center">
      <div className="flex flex-col bg-white px-40 py-10 gap-8 justify-between items-center rounded-xl shadow-custom">
        <h1 className="text-3xl">Email Confirmation</h1>
        {status === "succeeded" ? (
          <div className="flex w-full items-center text-lg text-center text-green-800">
            <CheckCircleIcon sx={{ fontSize: "2rem" }} />
            <span className="ml-2">
              <span className="ml-2">{message}</span>
            </span>
          </div>
        ) : status === "failed" ? (
          <div className="flex w-full items-center text-lg text-center text-red-600">
            <ErrorIcon sx={{ fontSize: "2rem" }} />
            <span className="ml-2">
              <span className="ml-2">{error}</span>
            </span>
          </div>
        ) : (
          <div className="flex w-full items-center text-lg text-center text-green-800">
            <CheckCircleIcon sx={{ fontSize: "2rem" }} />
            <span className="ml-2">
              <span className="ml-2">
                Account created successfully. Please check your email to verify
                your account.
              </span>
            </span>
          </div>
        )}
        <div className="gap-0">
          <p className="text-gray-400 text-xs">
            If you didn&apos;t get any email, please:
          </p>
          <button
            className="
            w-full rounded-lg bg-primaryLite text-gray-800
            mt-2 px-4 py-1.5 text-lg font-semibold text-center hover:text-black
            hover:scale-105 active:scale-100 active:shadow-inset-2 transition-all duration-300 text-nowrap
            disabled:scale-100 disabled:shadow-inset-2 disabled:text-zinc-400 disabled:cursor-progress
          "
            onClick={handleClick}
            disabled={loading || countdown > 0}
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
                </span>
              </>
            ) : countdown > 0 ? (
              <>
                Try again in <AnimatedCountdown countdown={countdown} />
              </>
            ) : (
              "Resend Email"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
