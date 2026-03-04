import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { resetPassword, clearErrors } from "@/redux/features/password/resetPasswordSlice";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { Typography } from "@/theme";
import placeholder from "@/assets/placeholder.svg";

export const PasswordRecover = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { status, message, errors, resetToken, resetCompleted } = useAppSelector(
    (state: any) => state.password
  );

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  useEffect(() => {
    // Проверяем наличие токена для сброса пароля при маунте/изменении
    const token = resetToken || localStorage.getItem("passwordResetToken");
    if (!token) {
      toast.error("Please try again");
      navigate("/sign-in");
      return;
    }
  }, [resetToken, navigate]);

  // Редиректим на логин только после УСПЕШНОГО сброса пароля
  useEffect(() => {
    if (resetCompleted) {
      toast.success(message || "Password reset successfully");
      navigate("/sign-in", { replace: true });
    }
  }, [resetCompleted, message, navigate]);

  const loading = status === "loading";

  const handleCancel = () => {
    // Очищаем временный токен и ошибки, возвращаем на логин
    try {
      localStorage.removeItem("passwordResetToken");
    } catch {}
    dispatch(clearErrors());
    navigate("/sign-in", { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const token = resetToken || localStorage.getItem("passwordResetToken");
    if (!token) {
      toast.error("Reset token not found");
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
      localStorage.removeItem("passwordResetToken");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      if (err && Array.isArray(err) && err.length > 0) {
        toast.error(err[0].message || "Unknown error");
        dispatch(clearErrors());
      }
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="flex min-h-svh w-full">
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-xs">
          <div className="flex flex-col items-center gap-2 text-center mb-lg">
            <Typography.h2>Set a new password</Typography.h2>
            <Typography.bodySm className="text-balance text-muted-foreground">
              Enter your new password and confirm it below.
            </Typography.bodySm>
          </div>
          <form noValidate onSubmit={handleSubmit} className="space-y-lg">
            <FieldGroup className="grid gap-6">
              <Field className="grid gap-2">
                <FieldLabel htmlFor="new-password">New password</FieldLabel>
                <Input
                  id="new-password"
                  name="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />
              </Field>
              <Field className="grid gap-2">
                <FieldLabel htmlFor="confirm-new-password">Confirm new password</FieldLabel>
                <Input
                  id="confirm-new-password"
                  name="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />
              </Field>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  className="w-1/2"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  loadingText="Resetting..."
                  className="w-1/2"
                >
                  Reset password
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
      <div className="relative hidden w-1/2 lg:block">
        <img
          alt="Authentication"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          height={1080}
          src={placeholder}
          width={1920}
        />
      </div>
    </div>
  );
};
