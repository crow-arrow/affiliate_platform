import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { businessSignUp } from "@/redux/features/tenant/tenantSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const schema = z
  .object({
    companyName: z.string().min(2, "Company name is required"),
    first_name: z.string().min(2),
    last_name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*+?&]).+/, "Weak password"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type BizForm = z.infer<typeof schema>;

export function BusinessSignupForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector((s) => s.auth.status);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<BizForm>({ resolver: zodResolver(schema) });

  const loading = status === "loading";

  const onSubmit = async (data: BizForm) => {
    try {
      const res = await dispatch(
        businessSignUp({
          companyName: data.companyName,
          email: data.email,
          phone: data.phone,
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password,
        })
      ).unwrap();

      toast.success(res.message || "Company registered");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.[0]?.message || "Failed to register company");
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your company</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Register a new workspace and admin account
        </p>
      </div>

      <FieldGroup className="grid grid-cols-1 gap-4">
        <Field className="grid gap-2">
          <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
          <Input id="companyName" {...register("companyName")} disabled={loading} />
          {errors.companyName && (
            <span className="text-sm text-red-500">{errors.companyName.message}</span>
          )}
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field className="grid gap-2">
            <FieldLabel htmlFor="first_name">First Name</FieldLabel>
            <Input id="first_name" {...register("first_name")} disabled={loading} />
            {errors.first_name && (
              <span className="text-sm text-red-500">{errors.first_name.message}</span>
            )}
          </Field>
          <Field className="grid gap-2">
            <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
            <Input id="last_name" {...register("last_name")} disabled={loading} />
            {errors.last_name && (
              <span className="text-sm text-red-500">{errors.last_name.message}</span>
            )}
          </Field>
        </div>
        <Field className="grid gap-2">
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" {...register("email")} disabled={loading} />
          {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
        </Field>
        <Field className="grid gap-2">
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <Input id="phone" {...register("phone")} disabled={loading} />
        </Field>
        <Field className="grid gap-2">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" {...register("password")} disabled={loading} />
          {errors.password && (
            <span className="text-sm text-red-500">{errors.password.message}</span>
          )}
        </Field>
        <Field className="grid gap-2">
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            disabled={loading}
          />
          {errors.confirmPassword && (
            <span className="text-sm text-red-500">{errors.confirmPassword.message}</span>
          )}
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? "Creating..." : "Create company"}
      </Button>
    </form>
  );
}
