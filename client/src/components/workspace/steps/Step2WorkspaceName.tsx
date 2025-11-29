import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { WorkspaceFormData } from "../CreateWorkspace";
import axios from "@/utils/axios";
import { toast } from "sonner";

interface Step2WorkspaceNameProps {
  formData: WorkspaceFormData;
  updateFormData: (updates: Partial<WorkspaceFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2WorkspaceName({
  formData,
  updateFormData,
  onNext,
  onBack,
}: Step2WorkspaceNameProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Проверка доступности названия при изменении (debounce)
  useEffect(() => {
    const workspaceName = formData.workspaceName.trim();

    // Сбрасываем состояние, если поле пустое
    if (!workspaceName) {
      setIsNameAvailable(null);
      setErrorMessage(null);
      return;
    }

    // Минимальная длина для проверки
    if (workspaceName.length < 2) {
      setIsNameAvailable(null);
      setErrorMessage(null);
      return;
    }

    // Очищаем предыдущий таймер
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }

    // Устанавливаем новый таймер для debounce (500ms)
    setIsChecking(true);
    checkTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await axios.get("/tenant/check-name", {
          params: { name: workspaceName },
        });

        if (response.data.available) {
          setIsNameAvailable(true);
          setErrorMessage(null);
        } else {
          setIsNameAvailable(false);
          setErrorMessage(response.data.message || "This workspace name is already taken");
        }
      } catch (error: any) {
        // Если ошибка 400 или другая, считаем что название недоступно
        setIsNameAvailable(false);
        setErrorMessage(
          error.response?.data?.message || "Failed to check workspace name availability"
        );
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [formData.workspaceName]);

  const handleNext = async () => {
    const workspaceName = formData.workspaceName.trim();

    if (!workspaceName) {
      toast.error("Please enter a workspace name");
      return;
    }

    // Если проверка еще идет, ждем
    if (isChecking) {
      toast.info("Please wait while we check the workspace name...");
      return;
    }

    // Если название недоступно, не переходим дальше
    if (isNameAvailable === false) {
      toast.error(errorMessage || "This workspace name is already taken. Please choose another one.");
      return;
    }

    // Если проверка еще не завершена, делаем финальную проверку
    if (isNameAvailable === null) {
      setIsValidating(true);
      try {
        const response = await axios.get("/tenant/check-name", {
          params: { name: workspaceName },
        });

        if (!response.data.available) {
          setIsNameAvailable(false);
          setErrorMessage(response.data.message || "This workspace name is already taken");
          toast.error(response.data.message || "This workspace name is already taken");
          setIsValidating(false);
          return;
        }

        setIsNameAvailable(true);
        setIsValidating(false);
        onNext();
      } catch (error: any) {
        setIsNameAvailable(false);
        setErrorMessage(
          error.response?.data?.message || "Failed to check workspace name availability"
        );
        toast.error(error.response?.data?.message || "Failed to validate workspace name");
        setIsValidating(false);
      }
    } else {
      // Если проверка уже пройдена и название доступно, переходим дальше
      onNext();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">What do you want to call your workspace?</h1>
        <p className="text-muted-foreground text-sm">
          Choose something that your team will recognize, like the name of your company or team.
        </p>
      </div>

      <FieldGroup className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="workspaceName" className="sr-only">
            Workspace Name
          </FieldLabel>
          <div className="relative">
            <Input
              id="workspaceName"
              placeholder="Ex: Acme Marketing or Acme Co"
              value={formData.workspaceName}
              onChange={(e) => updateFormData({ workspaceName: e.target.value })}
              className={`h-12 text-base ${
                isNameAvailable === false
                  ? "border-destructive focus-visible:ring-destructive"
                  : isNameAvailable === true
                  ? "border-green-500 focus-visible:ring-green-500"
                  : ""
              }`}
              autoFocus
            />
            {isChecking && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
            {!isChecking && isNameAvailable === true && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {!isChecking && isNameAvailable === false && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  className="h-5 w-5 text-destructive"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
          {errorMessage && (
            <p className="text-sm text-destructive mt-1">{errorMessage}</p>
          )}
          {isNameAvailable === true && !errorMessage && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Great! This workspace name is available.
            </p>
          )}
          <FieldDescription>
            This is the name that will appear for your workspace. You can change it later.
          </FieldDescription>
        </Field>
      </FieldGroup>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} size="lg" className="px-8">
          Back
        </Button>
        <Button
          onClick={handleNext}
          size="lg"
          className="px-8"
          disabled={isValidating || isChecking || isNameAvailable === false}
        >
          {isValidating || isChecking ? "Checking..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
