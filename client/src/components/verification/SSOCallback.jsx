import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export const SSOCallback = () => {
  const { handleRedirectCallback } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        await handleRedirectCallback();
        navigate("/oauth-done");
      } catch (err) {
        console.error("❌ Ошибка при handleRedirectCallback:", err);
        navigate("/sign-in");
      }
    };
    run();
  }, [handleRedirectCallback, navigate]);

  return <p>Обработка OAuth редиректа…</p>;
};
