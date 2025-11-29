import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changePassword } from "@/redux/features/password/resetPasswordSlice";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ChangePasswordForm = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((s: any) => s.password || { status: "idle" });
  const loading = status === "loading";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("New password must differ from current");
      return;
    }

    const res = await dispatch(changePassword({ currentPassword, newPassword }));
    if ((changePassword as any).fulfilled.match(res)) {
      toast.success((res as any).payload?.message || "Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      const msg = (res as any).payload || "Failed to change password";
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      <FieldGroup className="grid gap-4">
        <Field className="grid gap-2">
          <FieldLabel htmlFor="current-password">Current password</FieldLabel>
          <Input
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </Field>
        <Field className="grid gap-2">
          <FieldLabel htmlFor="new-password">New password</FieldLabel>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Field>
        <Field className="grid gap-2">
          <FieldLabel htmlFor="confirm-new-password">Confirm new password</FieldLabel>
          <Input
            id="confirm-new-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Field>
        <div className="flex justify-end">
          <Button type="submit" loading={loading} loadingText="Saving..." className="md:w-1/4">
            Change password
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};
