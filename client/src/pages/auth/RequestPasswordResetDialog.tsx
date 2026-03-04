import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { requestPasswordReset, clearErrors } from "@/redux/features/password/resetPasswordSlice";
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
import { applyTypography } from "@/theme";

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
  const [email, setEmail] = useState("");
  const loading = status === "loading";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    (e as unknown as Event).stopPropagation();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      const res = await dispatch(requestPasswordReset(email));
      if ((requestPasswordReset as any).fulfilled.match(res)) {
        toast.success("We sent a 6‑digit code to your email.");
        // Сначала делаем навигацию синхронно с replace: true
        navigate(`/verify-otp?email=${encodeURIComponent(email)}&type=password-reset`, {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>Enter your email and we’ll send a 6‑digit code.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={onSubmit}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </Field>
            <div className="flex justify-end gap-2 pt-sm">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={loading} loadingText="Sending...">
                Send code
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
