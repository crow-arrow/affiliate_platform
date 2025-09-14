import { useEffect, useRef } from "react";
import { useAuth, useUser, useClerk } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { loginWithOAuth } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const OAuthCallback = () => {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { handleRedirectCallback } = useClerk();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const calledRef = useRef(false);

  useEffect(() => {
    const run = async () => {
      try {
        // ⚡ шаг 1: обработать редирект сразу
        await handleRedirectCallback();

        if (!isLoaded || !userId || !sessionId || calledRef.current) {
          console.log("⏳ Clerk ещё не готов:", {
            isLoaded,
            userId,
            sessionId,
          });
          return;
        }

        // ⚡ шаг 2: получить токен
        const token = await getToken({ template: "backend" });
        console.log("🔑 Получен токен:", token);

        if (!token) {
          console.warn("⚠️ Clerk вернул null вместо токена");
          return;
        }

        calledRef.current = true;
        await dispatch(loginWithOAuth({ token }));
        toast.success("Login successful!");
        navigate("/my-account");
      } catch (err) {
        console.error("❌ Ошибка при handleRedirectCallback/login:", err);
        toast.error("OAuth login failed. Please try again.");
        navigate("/sign-in");
      }
    };

    run();
  }, [
    isLoaded,
    userId,
    sessionId,
    getToken,
    dispatch,
    navigate,
    handleRedirectCallback,
  ]);

  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <p>Finishing OAuth login, please wait…</p>
    </div>
  );
};
