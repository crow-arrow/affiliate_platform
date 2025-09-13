import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/features/auth/authSlice";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const OAuthCallback = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [message, setMessage] = useState("Обработка авторизации...");

  const {
    isLoading,
    status: authStatus,
    errors,
    message: authMessage,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Получаем параметры из URL
        const urlParams = new URLSearchParams(window.location.search);
        let token = urlParams.get("token");
        const error = urlParams.get("error");
        const provider = urlParams.get("provider");
        const hash = window.location.hash;

        console.log("OAuth callback params:", {
          token,
          error,
          provider,
          hash,
          fullUrl: window.location.href,
        });

        if (error) {
          setStatus("error");
          setMessage(`Ошибка авторизации: ${error}`);
          // setTimeout(() => {
          //   window.location.href = "/sign-in";
          // }, 3000);
          return;
        }

        if (!token) {
          // Проверим также hash для токена (некоторые OAuth провайдеры используют hash)
          const hashParams = new URLSearchParams(hash.replace("#", ""));
          const hashToken =
            hashParams.get("token") || hashParams.get("access_token");

          if (hashToken) {
            token = hashToken;
            console.log("Found token in hash:", hashToken);
          } else {
            setStatus("error");
            setMessage("Токен авторизации не найден в URL параметрах");
            console.error("No token found in URL or hash");
            setTimeout(() => {
              window.location.href = "/sign-in";
            }, 3000);
            return;
          }
        }

        console.log("Using token for OAuth login:", token);

        // Используем существующий loginUser thunk с параметром viaOAuth
        const result = await dispatch(
          loginUser({
            viaOAuth: token,
          })
        ).unwrap();

        console.log("OAuth login result:", result);

        setStatus("success");
        setMessage(
          result.message ||
            `Успешная авторизация через ${provider || "социальную сеть"}`
        );

        // Перенаправляем на главную страницу через 2 секунды
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("error");

        // Правильная обработка ошибок из вашего slice
        let errorMessage = "Произошла ошибка при авторизации";
        if (Array.isArray(error) && error.length > 0) {
          errorMessage = error[0]?.message || errorMessage;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        setMessage(errorMessage);
        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 3000);
      }
    };

    processOAuthCallback();
  }, [dispatch]);

  const getStatusIcon = () => {
    switch (status) {
      case "processing":
        return <Loader2 className="w-12 h-12 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "error":
        return <XCircle className="w-12 h-12 text-red-500" />;
      default:
        return <AlertCircle className="w-12 h-12 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "processing":
        return "text-blue-700";
      case "success":
        return "text-green-700";
      case "error":
        return "text-red-700";
      default:
        return "text-yellow-700";
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case "processing":
        return "bg-blue-50 border-blue-200";
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-yellow-50 border-yellow-200";
    }
  };

  const handleReturnToLogin = () => {
    window.location.href = "/sign-in";
  };

  const handleCancel = () => {
    window.location.href = "/sign-in";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Авторизация
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Завершение входа через социальную сеть
          </p>
        </div>

        <div className={`rounded-lg p-8 border-2 ${getBackgroundColor()}`}>
          <div className="flex flex-col items-center space-y-4">
            {getStatusIcon()}

            <div className="text-center">
              <h3 className={`text-lg font-medium ${getStatusColor()}`}>
                {status === "processing" && "Обработка..."}
                {status === "success" && "Успешно!"}
                {status === "error" && "Ошибка"}
              </h3>

              <p className="mt-2 text-sm text-gray-600">{message}</p>

              {status === "processing" && (
                <p className="mt-2 text-xs text-gray-500">
                  Пожалуйста, подождите...
                </p>
              )}

              {status === "success" && (
                <p className="mt-2 text-xs text-green-600">
                  Перенаправление на главную страницу...
                </p>
              )}

              {status === "error" && (
                <p className="mt-2 text-xs text-red-600">
                  Перенаправление на страницу входа...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Дополнительные действия */}
        <div className="text-center space-y-2">
          {status === "error" && (
            <button
              onClick={handleReturnToLogin}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Вернуться к странице входа
            </button>
          )}

          {status === "processing" && (
            <button
              onClick={handleCancel}
              className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
            >
              Отменить
            </button>
          )}
        </div>

        {/* Отладочная информация (можно убрать в продакшене) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Debug Info:
            </h4>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(
                {
                  url: window.location.href,
                  search: window.location.search,
                  hash: window.location.hash,
                  params: Object.fromEntries(
                    new URLSearchParams(window.location.search)
                  ),
                  hashParams: Object.fromEntries(
                    new URLSearchParams(window.location.hash.replace("#", ""))
                  ),
                  componentStatus: status,
                  authStatus: authStatus,
                  isLoading,
                  errors,
                  authMessage,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
