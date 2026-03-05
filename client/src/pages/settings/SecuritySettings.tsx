import React, { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { SetPasswordDialog } from "./SetPasswordDialog";
import { Button } from "@/components/ui/button";
import { Typography } from "@/theme";

export const SecuritySettings = () => {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [setPasswordOpen, setSetPasswordOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const hasPassword = user?.hasPassword ?? true;

  return (
    <div className="space-y-6">
      <Typography.h1>Security</Typography.h1>
      {hasPassword ? (
        <Button onClick={() => setChangePasswordOpen(true)}>Change Password</Button>
      ) : (
        <Button onClick={() => setSetPasswordOpen(true)}>Add Password</Button>
      )}
      <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
      <SetPasswordDialog open={setPasswordOpen} onOpenChange={setSetPasswordOpen} />
    </div>
  );
};
