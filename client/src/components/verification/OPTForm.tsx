import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AnimatedCountdown } from "@/components/utils/AnimatedCountdown";
import { Typography } from "@/theme";
import { getMe } from "@/redux/features/auth/authSlice";
import { verifyOTPCode, resendOTPCode } from "@/redux/features/verification/emailVerificationSlice";
import {
  verifyPasswordResetOTP,
  requestPasswordReset,
} from "@/redux/features/password/resetPasswordSlice";
import { AppDispatch } from "@/redux/store";
import { Loader2Icon } from "lucide-react";

export function OTPForm({ ...props }: React.ComponentProps<"div">) {
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

  // --- Resend timer (like in EmailSentMessage)
  const TIMER_DURATION_SECONDS = 120;
  const LOCAL_STORAGE_KEY =
    type === "password-reset" ? "resendOtpTimerEndTime_reset" : "resendOtpTimerEndTime_verify";
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdownInterval = (initialDuration: number) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current!);
    }
    let currentRemaining = initialDuration;
    timerIntervalRef.current = setInterval(() => {
      currentRemaining -= 1;
      setCountdown(currentRemaining);
      if (currentRemaining <= 0) {
        clearInterval(timerIntervalRef.current!);
        timerIntervalRef.current = null;
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setCountdown(0);
      }
    }, 1000);
  };

  useEffect(() => {
    if (!userEmail) {
      // Пытаемся получить email из localStorage или из Redux
      const storedEmail = localStorage.getItem("pendingVerificationEmail");
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    }
  }, [userEmail]);

  // Restore timer from localStorage
  useEffect(() => {
    const storedEndTime = localStorage.getItem(LOCAL_STORAGE_KEY);
    const now = Date.now();
    if (storedEndTime) {
      const endTime = parseInt(storedEndTime, 10);
      const remainingTimeSeconds = Math.max(0, Math.ceil((endTime - now) / 1000));
      if (remainingTimeSeconds > 0) {
        setCountdown(remainingTimeSeconds);
        startCountdownInterval(remainingTimeSeconds);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setCountdown(0);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current!);
      }
    };
  }, [LOCAL_STORAGE_KEY]);

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
          navigate("/reset-password", { replace: true });
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
    if (resendLoading || countdown > 0) return;

    if (type === "password-reset") {
      // Повторная отправка OTP для восстановления пароля
      setResendLoading(true);
      const result = await dispatch(requestPasswordReset(userEmail));
      if (requestPasswordReset.fulfilled.match(result)) {
        toast.success("Password reset code sent successfully!");
        setValue(""); // Очищаем поле ввода
        const endTime = Date.now() + TIMER_DURATION_SECONDS * 1000;
        localStorage.setItem(LOCAL_STORAGE_KEY, endTime.toString());
        setCountdown(TIMER_DURATION_SECONDS);
        startCountdownInterval(TIMER_DURATION_SECONDS);
      } else {
        toast.error(error || "Failed to resend code");
      }
      setResendLoading(false);
    } else {
      // Повторная отправка OTP для верификации email
      setResendLoading(true);
      const result = await dispatch(resendOTPCode(userEmail));
      if (resendOTPCode.fulfilled.match(result)) {
        toast.success("Verification code sent successfully!");
        setValue(""); // Очищаем поле ввода
        const endTime = Date.now() + TIMER_DURATION_SECONDS * 1000;
        localStorage.setItem(LOCAL_STORAGE_KEY, endTime.toString());
        setCountdown(TIMER_DURATION_SECONDS);
        startCountdownInterval(TIMER_DURATION_SECONDS);
      } else {
        toast.error(error || "Failed to resend code");
      }
      setResendLoading(false);
    }
  };

  if (!userEmail) {
    return (
      <div className="flex flex-col gap-6" {...props}>
        <Typography.bodySm className="text-center text-muted-foreground">
          Email not found. Please register again.
        </Typography.bodySm>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <Typography.h2>
              {type === "password-reset" ? "Enter password reset code" : "Enter verification code"}
            </Typography.h2>
            <Typography.bodySm className="text-balance text-muted-foreground">
              We sent a 6-digit code to {userEmail}
            </Typography.bodySm>
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
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border text-foreground">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border text-foreground">
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border text-foreground">
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">
              Enter the 6-digit code sent to your email.
            </FieldDescription>
          </Field>
          <Button type="submit" disabled={isLoading || resendLoading || value.length !== 6}>
            {isLoading || resendLoading ? (
              <>
                Verifying
                <Loader2Icon className="animate-spin" />
              </>
            ) : (
              "Verify"
            )}
          </Button>
          <FieldDescription className="text-center">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading || resendLoading || countdown > 0}
              className="text-primary underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-50 focus-ring focus-visible:outline-none"
            >
              {resendLoading ? "Sending..." : "Resend"}
            </button>
          </FieldDescription>
          {countdown > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Try again in <AnimatedCountdown countdown={countdown} />
            </div>
          )}
        </FieldGroup>
      </form>
    </div>
  );
}
