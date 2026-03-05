import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { requestPasswordReset, clearErrors } from "@/redux/features/password/resetPasswordSlice";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  emailFormSchema,
  EmailFormData,
  showErrorsInOrder,
  getInputErrorClass,
} from "@/components/validation/formSchema";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Loader2Icon } from "lucide-react";

export function RequestPasswordResetDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, requestResetError } = useAppSelector((s: any) => s.password);
  const loading = status === "loading";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
  });

  const onSubmit = async (data: EmailFormData) => {
    try {
      const res = await dispatch(requestPasswordReset(data.email));
      if ((requestPasswordReset as any).fulfilled.match(res)) {
        toast.success("We sent a 6‑digit code to your email.");
        // Сначала делаем навигацию синхронно с replace: true
        navigate(`/verify-otp?email=${encodeURIComponent(data.email)}&type=password-reset`, {
          replace: true,
        });
        requestAnimationFrame(() => {
          onOpenChange(false);
        });
      } else {
        const msg = (res as any).payload || requestResetError || "Request failed";
        toast.error(msg);
      }
    } finally {
      dispatch(clearErrors());
    }
  };

  const onError = (errors: FieldErrors<EmailFormData>) => {
    showErrorsInOrder(errors, ["email"]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>Enter your email and we’ll send a 6‑digit code.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="mt-4"
          onKeyDownCapture={(e) => {
            if (e.key === "Enter") e.stopPropagation();
          }}
        >
          <FieldGroup className="grid gap-4">
            <Field className="grid gap-2">
              <FieldLabel htmlFor="reset-email">Email</FieldLabel>
              <Input
                id="reset-email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className={getInputErrorClass("email", errors)}
                autoFocus
              />
            </Field>
            <div className="flex justify-end gap-2 pt-sm">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    Sending
                    <Loader2Icon className="animate-spin" />
                  </>
                ) : (
                  "Send code"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
