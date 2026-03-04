import React, { useState } from "react";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { Button } from "@/components/ui/button";
import { Typography } from "@/theme";

export const SecuritySettings = () => {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  return (
    <div className="space-y-6">
      <Typography.h1>Security</Typography.h1>
      <Button onClick={() => setChangePasswordOpen(true)}>Change Password</Button>
      <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </div>
  );
};
