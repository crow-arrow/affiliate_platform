import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SetPasswordForm } from "./SetPasswordForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function SetPasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm max-w-[calc(100vw-2rem)]">
        <DialogHeader className="flex-shrink-0 gap-2 mb-2">
          <DialogTitle>Add password</DialogTitle>
          <DialogDescription>
            You signed in with SSO. Add a password to also sign in with email and password.
          </DialogDescription>
          <Alert variant="info">
            <InfoIcon className="size-4" />
            <AlertDescription>
              Password must be at least 8 characters long and contain at least one uppercase letter,
              one lowercase letter, one number, and one special character.
            </AlertDescription>
          </Alert>
        </DialogHeader>
        <SetPasswordForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
