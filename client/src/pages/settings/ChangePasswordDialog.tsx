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
import { ChangePasswordForm } from "./ChangePasswordForm";
import { cn } from "@/lib/utils";

export function ChangePasswordDialog({
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
      <DialogContent className="sm:max-w-sm max-w-[calc(100vw-2rem)]">
        <DialogHeader className="flex-shrink-0 text-center gap-2 mb-2">
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>Enter your email and we’ll send a 6‑digit code.</DialogDescription>
        </DialogHeader>
        <ChangePasswordForm />
      </DialogContent>
    </Dialog>
  );
}
