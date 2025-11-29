import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkspaceFormData } from "../CreateWorkspace";
import { Check, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { businessSignUp } from "@/redux/features/tenant/tenantSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/axios";

interface Step4ChoosePlanProps {
  formData: WorkspaceFormData;
  updateFormData: (updates: Partial<WorkspaceFormData>) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function Step4ChoosePlan({
  formData,
  updateFormData,
  onBack,
  onSubmit,
}: Step4ChoosePlanProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectPlan = (plan: "free" | "pro") => {
    updateFormData({ plan });
  };

  const handleSubmit = async () => {
    if (!formData.plan) {
      toast.error("Please select a plan");
      return;
    }

    if (!formData.workspaceName.trim()) {
      toast.error("Workspace name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Используем данные из текущего пользователя, если он авторизован
      const email = user?.email || "";
      const firstName = formData.firstName || user?.firstName || "";
      const lastName = formData.lastName || user?.lastName || "";

      if (!email) {
        toast.error("Please sign in first or provide email");
        navigate("/sign-in");
        return;
      }

      // Создаем workspace через API
      const workspaceData: any = {
        companyName: formData.workspaceName,
        email: email,
        first_name: firstName,
        last_name: lastName,
        plan: formData.plan,
        invitedEmails: formData.invitedEmails,
      };

      // Если пользователь еще не зарегистрирован, нужен password
      // Для уже зарегистрированных пользователей password не обязателен
      const result = await dispatch(
        businessSignUp({
          companyName: workspaceData.companyName,
          email: workspaceData.email,
          first_name: workspaceData.first_name,
          last_name: workspaceData.last_name,
          password: "", // Для существующих пользователей password не обязателен
          phone: undefined,
        })
      ).unwrap();

      toast.success(result.message || "Workspace created successfully!");

      // Если есть аватар, загружаем его
      if (formData.avatarFile) {
        try {
          const avatarFormData = new FormData();
          avatarFormData.append("avatar", formData.avatarFile);
          await axios.patch("/me/upload-avatar", avatarFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch (avatarError) {
          console.error("Failed to upload avatar:", avatarError);
          // Не блокируем создание workspace, если аватар не загрузился
        }
      }

      // Если есть приглашенные email, отправляем приглашения
      if (formData.invitedEmails.length > 0) {
        // TODO: Отправить приглашения через API
        console.log("Sending invitations to:", formData.invitedEmails);
      }

      navigate("/");
    } catch (error: any) {
      toast.error(error?.[0]?.message || error?.message || "Failed to create workspace");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Your workspace is ready to go! ✨</h1>
        <h2 className="text-2xl font-semibold mt-4">Start with Slack Pro</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pro Plan */}
        <Card
          className={`p-6 cursor-pointer transition-all ${
            formData.plan === "pro"
              ? "ring-2 ring-primary border-primary"
              : "hover:border-primary/50"
          }`}
          onClick={() => handleSelectPlan("pro")}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Pro Plan</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  €4.13 per person/month
                </p>
              </div>
              {formData.plan === "pro" && (
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">50% off 3 months</p>
                <p className="text-xs text-muted-foreground">Limited time offer</p>
              </div>
            </div>

            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Unlimited message history</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Group meetings with AI notes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Work with people at other organizations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>AI conversation summaries</span>
              </li>
            </ul>

            <Button
              className="w-full mt-4"
              variant={formData.plan === "pro" ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectPlan("pro");
              }}
            >
              Start with Pro
            </Button>
          </div>
        </Card>

        {/* Free Plan */}
        <Card
          className={`p-6 cursor-pointer transition-all ${
            formData.plan === "free"
              ? "ring-2 ring-primary border-primary"
              : "hover:border-primary/50"
          }`}
          onClick={() => handleSelectPlan("free")}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Free Plan</h3>
                <p className="text-sm text-muted-foreground mt-1">€0 per person/month</p>
              </div>
              {formData.plan === "free" && (
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>

            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Limited message history (last 90 days)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Basic features</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Team collaboration</span>
              </li>
            </ul>

            <Button
              className="w-full mt-4"
              variant={formData.plan === "free" ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectPlan("free");
              }}
            >
              Start with the Limited Free Version
            </Button>
          </div>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} size="lg" className="px-8" disabled={isSubmitting}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          size="lg"
          className="px-8"
          disabled={!formData.plan || isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Workspace"}
        </Button>
      </div>
    </div>
  );
}
