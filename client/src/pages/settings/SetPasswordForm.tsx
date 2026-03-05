import { FieldErrors } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPassword, clearErrors } from "@/redux/features/password/resetPasswordSlice";
import { getMe } from "@/redux/features/auth/authSlice";
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

interface SetPasswordFormProps {
  onSuccess?: () => void;
}

const orderedFields: (keyof SetPasswordFormData)[] = ["newPassword", "confirmPassword"];

export const SetPasswordForm = ({ onSuccess }: SetPasswordFormProps) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((s: any) => s.password || { status: "idle" });
  const loading = status === "loading";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
  });

  const onSubmit = async (data: SetPasswordFormData) => {
    const res = await dispatch(setPassword({ newPassword: data.newPassword }));
    if ((setPassword as any).fulfilled.match(res)) {
      toast.success((res as any).payload?.message || "Password set successfully");
      reset();
      dispatch(clearErrors());
      await dispatch(getMe());
      onSuccess?.();
    } else {
      const msg = (res as any).payload || "Failed to set password";
      toast.error(msg);
    }
  };

  const onError = (errors: FieldErrors<SetPasswordFormData>) => {
    showErrorsInOrder(errors, orderedFields);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full" noValidate>
      <FieldGroup className="grid gap-4">
        <Field className="grid gap-2">
          <FieldLabel htmlFor="new-password">New password</FieldLabel>
          <PasswordInput
            id="new-password"
            autoComplete="new-password"
            placeholder="*********"
            {...register("newPassword")}
            className={getInputErrorClass("newPassword", errors)}
          />
        </Field>
        <Field className="grid gap-2">
          <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
          <PasswordInput
            id="confirm-password"
            autoComplete="new-password"
            placeholder="*********"
            {...register("confirmPassword")}
            className={getInputErrorClass("confirmPassword", errors)}
          />
        </Field>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? <Loader2Icon className="animate-spin" /> : "Add password"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};
