import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyOTPCode, resendOTPCode } from "@/redux/features/verification/emailVerificationSlice";
import {
  verifyPasswordResetOTP,
  requestPasswordReset,
} from "@/redux/features/password/resetPasswordSlice";
import { getMe } from "@/redux/features/auth/authSlice";
import { AppDispatch } from "@/redux/store";
import { toast } from "sonner";

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  const [value, setValue] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "email-verification"; // email-verification или password-reset

  const verificationState = useSelector((state: any) => state.verification);
  const passwordState = useSelector((state: any) => state.password);

  const isLoading =
    type === "password-reset"
      ? passwordState.status === "loading"
      : verificationState.status === "loading";

  const error =
    type === "password-reset" ? passwordState.requestResetError : verificationState.error;

  // Если email не передан в URL, пытаемся получить из localStorage
  const [userEmail, setUserEmail] = useState(email);

  useEffect(() => {
    if (!userEmail) {
      // Пытаемся получить email из localStorage или из Redux
      const storedEmail = localStorage.getItem("pendingVerificationEmail");
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    }
  }, [userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userEmail) {
      toast.error("Email is required");
      return;
    }

    if (value.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    if (type === "password-reset") {
      // Верификация OTP для восстановления пароля
      const result = await dispatch(verifyPasswordResetOTP({ email: userEmail, code: value }));

      if (verifyPasswordResetOTP.fulfilled.match(result)) {
        // Сохраняем токен для сброса пароля
        if (result.payload.token) {
          localStorage.setItem("passwordResetToken", result.payload.token);
          toast.success(result.payload.message || "Code verified successfully!");

          // Редиректим на страницу сброса пароля
          navigate("/reset-password");
        }
      } else {
        toast.error(error || "Invalid verification code");
      }
    } else {
      // Верификация email
      const result = await dispatch(verifyOTPCode({ email: userEmail, code: value }));

      if (verifyOTPCode.fulfilled.match(result)) {
        // Сохраняем токен
        if (result.payload.token) {
          localStorage.setItem("token", result.payload.token);
          localStorage.removeItem("pendingVerificationEmail");

          // Обновляем состояние пользователя
          await dispatch(getMe());

          toast.success(result.payload.message || "Email verified successfully!");

          // Редиректим на главную
          navigate("/");
        }
      } else {
        toast.error(error || "Invalid verification code");
      }
    }
  };

  const handleResend = async () => {
    if (!userEmail) {
      toast.error("Email is required");
      return;
    }

    if (type === "password-reset") {
      // Повторная отправка OTP для восстановления пароля
      const result = await dispatch(requestPasswordReset(userEmail));
      if (requestPasswordReset.fulfilled.match(result)) {
        toast.success("Password reset code sent successfully!");
        setValue(""); // Очищаем поле ввода
      } else {
        toast.error(error || "Failed to resend code");
      }
    } else {
      // Повторная отправка OTP для верификации email
      const result = await dispatch(resendOTPCode(userEmail));
      if (resendOTPCode.fulfilled.match(result)) {
        toast.success("Verification code sent successfully!");
        setValue(""); // Очищаем поле ввода
      } else {
        toast.error(error || "Failed to resend code");
      }
    }
  };

  if (!userEmail) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="text-center">
          <p className="text-muted-foreground">Email not found. Please register again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">
              {type === "password-reset" ? "Enter password reset code" : "Enter verification code"}
            </h1>
            <p className="text-muted-foreground text-sm text-balance">
              We sent a 6-digit code to {userEmail}
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>
            <InputOTP
              maxLength={6}
              id="otp"
              value={value}
              onChange={setValue}
              disabled={isLoading}
              required
            >
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">
              Enter the 6-digit code sent to your email.
            </FieldDescription>
          </Field>
          <Button type="submit" disabled={isLoading || value.length !== 6}>
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
          <FieldDescription className="text-center">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="text-primary underline-offset-4 hover:underline"
            >
              Resend
            </button>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
