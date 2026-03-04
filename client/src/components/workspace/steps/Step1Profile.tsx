import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { WorkspaceFormData } from "../CreateWorkspace";
import { User, Camera } from "lucide-react";

interface Step1ProfileProps {
  formData: WorkspaceFormData;
  updateFormData: (updates: Partial<WorkspaceFormData>) => void;
  onNext: () => void;
}

export function Step1Profile({ formData, updateFormData, onNext }: Step1ProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Валидация типа файла
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Валидация размера (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      updateFormData({ avatarFile: file });

      // Создаем preview
      const reader = new FileReader();
      reader.onload = (event) => {
        updateFormData({ avatarPreview: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleNext = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert("Please enter your first and last name");
      return;
    }
    onNext();
  };

  const getInitials = () => {
    const first = formData.firstName.charAt(0).toUpperCase();
    const last = formData.lastName.charAt(0).toUpperCase();
    return first + last;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">What's your name?</h1>
        <p className="text-muted-foreground text-sm">
          Adding your name and profile photo helps your teammates recognize and connect with you
          more easily.
        </p>
      </div>

      <FieldGroup className="flex flex-col gap-6">
        <Field>
          <FieldLabel htmlFor="name" className="sr-only">
            Full Name
          </FieldLabel>
          <Input
            id="name"
            placeholder="Enter your full name"
            value={`${formData.firstName} ${formData.lastName}`.trim()}
            onChange={(e) => {
              const fullName = e.target.value;
              const parts = fullName.split(" ");
              updateFormData({
                firstName: parts[0] || "",
                lastName: parts.slice(1).join(" ") || "",
              });
            }}
            className="h-12 text-base"
          />
          <FieldDescription>
            This is how your name will appear to other members of your workspace.
          </FieldDescription>
        </Field>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              Your profile photo <span className="text-muted-foreground font-normal">(optional)</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Help your teammates know they're talking to the right person.
            </p>
          </div>

          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              {formData.avatarPreview ? (
                <AvatarImage src={formData.avatarPreview} alt="Profile" />
              ) : (
                <AvatarFallback className="text-2xl bg-muted">
                  {getInitials() || <User className="h-8 w-8" />}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleEditPhoto}
                className="w-fit"
              >
                <Camera className="h-4 w-4 mr-2" />
                Edit Photo
              </Button>
              {formData.avatarFile && (
                <p className="text-xs text-muted-foreground">
                  {formData.avatarFile.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </FieldGroup>

      <div className="flex justify-start pt-4">
        <Button onClick={handleNext} size="lg" className="px-8">
          Next
        </Button>
      </div>
    </div>
  );
}
