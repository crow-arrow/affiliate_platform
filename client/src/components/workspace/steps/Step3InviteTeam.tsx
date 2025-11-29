import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { WorkspaceFormData } from "../CreateWorkspace";
import { X, Mail, Link2 } from "lucide-react";
import { toast } from "sonner";

interface Step3InviteTeamProps {
  formData: WorkspaceFormData;
  updateFormData: (updates: Partial<WorkspaceFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function Step3InviteTeam({
  formData,
  updateFormData,
  onNext,
  onBack,
  onSkip,
}: Step3InviteTeamProps) {
  const [emailInput, setEmailInput] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (!email) return;

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Проверка на дубликаты
    if (formData.invitedEmails.includes(email)) {
      toast.error("This email is already added");
      return;
    }

    updateFormData({
      invitedEmails: [...formData.invitedEmails, email],
    });
    setEmailInput("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    updateFormData({
      invitedEmails: formData.invitedEmails.filter((email) => email !== emailToRemove),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleAddMultipleEmails = () => {
    const emails = emailInput
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e);

    emails.forEach((email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email) && !formData.invitedEmails.includes(email)) {
        updateFormData({
          invitedEmails: [...formData.invitedEmails, email],
        });
      }
    });
    setEmailInput("");
  };

  const handleCopyInviteLink = async () => {
    if (!inviteLink) {
      // Генерируем временную ссылку (в реальном приложении это будет с сервера)
      const link = `${window.location.origin}/invite/${formData.workspaceName}-${Date.now()}`;
      setInviteLink(link);
    }

    try {
      await navigator.clipboard.writeText(inviteLink || `${window.location.origin}/invite/temp`);
      toast.success("Invite link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">
          Who else is on the{" "}
          <span className="text-primary">{formData.workspaceName || "your"}</span> team?
        </h1>
      </div>

      <FieldGroup className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <FieldLabel className="text-base font-semibold">Add coworker by email</FieldLabel>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary"
              onClick={() => toast.info("Google Contacts integration coming soon")}
            >
              <Mail className="h-4 w-4 mr-2" />
              Add from Google Contacts
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Ex. ellis@gmail.com, maria@gmail.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-12 text-base"
            />
            <Button type="button" onClick={handleAddMultipleEmails}>
              Add
            </Button>
          </div>

          {formData.invitedEmails.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.invitedEmails.map((email) => (
                <Badge key={email} variant="secondary" className="gap-2 py-1.5 px-3">
                  {email}
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <FieldDescription>
            Keep in mind that invitations expire in 30 days. You can always extend that deadline.
          </FieldDescription>
        </div>
      </FieldGroup>

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={onBack} size="lg" className="px-8">
          Back
        </Button>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyInviteLink}
            className="px-6"
          >
            <Link2 className="h-4 w-4 mr-2" />
            Copy Invite Link
          </Button>
          <Button variant="ghost" onClick={onSkip} className="px-6">
            Skip this step
          </Button>
          <Button onClick={onNext} size="lg" className="px-8">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
