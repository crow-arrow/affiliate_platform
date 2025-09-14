import { useEffect, useRef } from "react";
import { useClerk, useAuth, useUser } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { loginWithOAuth } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const OAuthCallback = () => {
  const { handleRedirectCallback } = useClerk();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // чтобы не запускалось дважды
  const calledRef = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (calledRef.current) return;

      try {
        // 1️⃣ Обрабатываем редирект (ставим сессию)
        await handleRedirectCallback();

        // 2️⃣ Получаем токен
        const token = await getToken();
        console.log("Получен токен:", token);

        if (token) {
          calledRef.current = true;

          // 3️⃣ Диспатчим в бэкенд
          await dispatch(loginWithOAuth({ token }));
          toast.success("Login successful!");
          navigate("/my-account");
        } else {
          console.error("❌ Clerk не вернул токен");
          toast.error("OAuth login failed. No token received.");
          navigate("/sign-in");
        }
      } catch (e) {
        console.error("❌ Ошибка Clerk callback:", e);
        toast.error("OAuth login failed.");
        navigate("/sign-in");
      }
    };

    run();
  }, [handleRedirectCallback, getToken, dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <p>Processing OAuth login...</p>
    </div>
  );
};
