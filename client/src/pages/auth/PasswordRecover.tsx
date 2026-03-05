import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { resetPassword, clearErrors } from "@/redux/features/password/resetPasswordSlice";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  setPasswordSchema,
  SetPasswordFormData,
  getInputErrorClass,
  showErrorsInOrder,
} from "@/components/validation/formSchema";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { Typography } from "@/theme";
import placeholder from "@/assets/placeholder.svg";

const orderedFields: (keyof SetPasswordFormData)[] = ["newPassword", "confirmPassword"];

export const PasswordRecover = () => {
  const { status, message, resetToken, resetCompleted } = useAppSelector(
    (state: any) => state.password
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
  });

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

  const onSubmit = async (data: SetPasswordFormData) => {
    const token = resetToken || localStorage.getItem("passwordResetToken");
    if (!token) {
      toast.error("Reset token not found");
      return;
    }
    try {
      await dispatch(
        resetPassword({
          token,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        })
      ).unwrap();
      localStorage.removeItem("passwordResetToken");
      reset();
    } catch (errors) {
      if (Array.isArray(errors) && errors.length > 0) {
        toast.error(errors[0].message || "Server error");
        dispatch(clearErrors());
      }
    }
  };

  const onError = (errors: FieldErrors<SetPasswordFormData>) => {
    showErrorsInOrder(errors, orderedFields);
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
          <form noValidate onSubmit={handleSubmit(onSubmit, onError)} className="space-y-lg">
            <FieldGroup className="grid gap-6">
              <Field className="grid gap-2">
                <FieldLabel htmlFor="new-password">New password</FieldLabel>
                <PasswordInput
                  id="new-password"
                  autoComplete="new-password"
                  {...register("newPassword")}
                  className={getInputErrorClass("newPassword", errors)}
                  placeholder="Enter new password"
                  disabled={loading}
                  required
                />
              </Field>
              <Field className="grid gap-2">
                <FieldLabel htmlFor="confirm-new-password">Confirm new password</FieldLabel>
                <PasswordInput
                  id="confirm-new-password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  className={getInputErrorClass("confirmPassword", errors)}
                  placeholder="Confirm new password"
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
                <Button type="submit" disabled={loading} className="w-1/2">
                  {loading ? (
                    <>
                      Resetting
                      <Loader2Icon className="animate-spin" />
                    </>
                  ) : (
                    "Reset password"
                  )}
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
