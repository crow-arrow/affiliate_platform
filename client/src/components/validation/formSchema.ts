import { z } from "zod";
import { FieldErrors } from "react-hook-form";
import { toast } from "sonner";

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
  return errors[name]
    ? "border-destructive focus-visible:ring-destructive"
    : "";
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

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
