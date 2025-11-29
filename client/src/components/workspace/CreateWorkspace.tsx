import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Step1Profile } from "./steps/Step1Profile";
import { Step2WorkspaceName } from "./steps/Step2WorkspaceName";
import { Step3InviteTeam } from "./steps/Step3InviteTeam";
import { Step4ChoosePlan } from "./steps/Step4ChoosePlan";

export interface WorkspaceFormData {
  // Step 1
  firstName: string;
  lastName: string;
  avatarFile?: File | null;
  avatarPreview?: string;

  // Step 2
  workspaceName: string;

  // Step 3
  invitedEmails: string[];

  // Step 4
  plan: "free" | "pro" | null;
}

export function CreateWorkspace() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WorkspaceFormData>({
    firstName: "",
    lastName: "",
    avatarFile: null,
    avatarPreview: undefined,
    workspaceName: "",
    invitedEmails: [],
    plan: null,
  });

  const updateFormData = (updates: Partial<WorkspaceFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Profile formData={formData} updateFormData={updateFormData} onNext={handleNext} />
        );
      case 2:
        return (
          <Step2WorkspaceName
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3InviteTeam
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleSkip}
          />
        );
      case 4:
        return (
          <Step4ChoosePlan
            formData={formData}
            updateFormData={updateFormData}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    // Логика создания workspace будет здесь
    console.log("Submitting workspace data:", formData);
    // TODO: Добавить API вызов для создания workspace
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-4">Step {currentStep} of 4</p>
        </div>

        {/* Step content */}
        <div className="bg-card rounded-lg p-8 shadow-lg">{renderStep()}</div>
      </div>
    </div>
  );
}
