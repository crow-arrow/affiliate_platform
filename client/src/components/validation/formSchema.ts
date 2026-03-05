import { z } from "zod";
import { FieldErrors } from "react-hook-form";
import { toast } from "sonner";

export const emailSchema = z.string().email("Enter a valid email format");

export const emailFormSchema = z.object({
  email: emailSchema,
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email format"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(1, "Phone is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function getInputErrorClass<T extends Record<string, any>>(
  name: keyof T,
  errors: FieldErrors<T>
): string {
  return errors[name] ? "border-destructive focus-visible:ring-destructive" : "";
}

export function showErrorsInOrder<T extends Record<string, any>>(
  errors: FieldErrors<T>,
  orderedFields?: (keyof T)[]
): void {
  const shown = new Set<string>();

  const fields = orderedFields || (Object.keys(errors) as (keyof T)[]);
  fields.forEach((field) => {
    const message = errors[field]?.message;
    if (typeof message === "string" && !shown.has(message)) {
      toast.error(message);
      shown.add(message);
    }
  });
}

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(50, "Password must be no longer than 50 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*+?&])[A-Za-z\d@$!%*+?&]+$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*+?&)"
  );

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must differ from current",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const setPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type EmailFormData = z.infer<typeof emailFormSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type SetPasswordFormData = z.infer<typeof setPasswordSchema>;
