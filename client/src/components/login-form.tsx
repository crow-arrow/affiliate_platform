import { useEffect } from "react";
import { FieldErrors } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  loginUser,
  checkIsAuth,
  clearErrors,
} from "@/redux/features/auth/authSlice";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  LoginFormData,
  getInputErrorClass,
  showErrorsInOrder,
} from "@/components/validation/formSchema";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldSeparator,
} from "@/components/ui/field";
import { toast } from "sonner";

import { useSignIn } from "@clerk/clerk-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { status, message, user } = useAppSelector((state) => state.auth);
  const isAuth = useAppSelector(checkIsAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { signIn } = useSignIn();

  const orderedFields: (keyof LoginFormData)[] = ["password", "email"];

  useEffect(() => {
    const error = signIn?.firstFactorVerification?.error;

    if (error && error.code === "oauth_access_denied") {
      toast.error(error.longMessage || error.message);

      signIn?.create({});
    }
  }, [signIn?.firstFactorVerification?.error]);

  useEffect(() => {
    if (status === "succeeded" && isAuth && user) {
      toast.success(message || "You are signed in!");
      // Редиректим на главную страницу, которая сама определит куда направить пользователя
      navigate("/");
    }
  }, [status, isAuth, user, navigate]);

  const loading = status === "loading";

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(loginUser(data)).unwrap();
    } catch (errors) {
      if (Array.isArray(errors)) {
        toast.error(errors[0]?.message || "Signin failed. Please try again.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      dispatch(clearErrors());
    }
  };

  const onError = (errors: FieldErrors<LoginFormData>) => {
    showErrorsInOrder(errors, orderedFields);
  };

  enum OAuthStrategy {
    Google = "oauth_google",
    LinkedIn = "oauth_linkedin_oidc",
    Facebook = "oauth_facebook",
  }

  const handleOAuth = (strategy: OAuthStrategy) => {
    if (!signIn) {
      toast.error("Not loaded yet, please try again.");
      return;
    }
    return signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/oauth-done",
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err, null, 2);
        toast.error("OAuth signin failed. Please try again.");
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2Icon className="animate-spin mr-2" />
        Checking authentication...
      </div>
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit, onError)}
      noValidate
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Login to your Jinn affiliate program
        </p>
      </div>
      <FieldGroup className="grid gap-6">
        <Field className="grid gap-2">
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="text"
            autoComplete="email"
            placeholder="exemple@jinn-travel.com"
            {...register("email")}
            className={cn(getInputErrorClass("email", errors))}
          />
        </Field>
        <Field className="grid gap-2">
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              to={"/request-reset"}
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="*********"
            autoComplete="current-password"
            {...register("password")}
            className={cn(getInputErrorClass("password", errors))}
          />
        </Field>
        <Button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center items-center gap-2 active:scale-95 transition-all
          disabled:scale-100 disabled:shadow-inset-2 disabled:animate-pulse disabled:cursor-progress"
        >
          {loading ? (
            <>
              <div className="flex items-center gap-2">
                <Loader2Icon className="animate-spin" />
                Please wait...
              </div>
            </>
          ) : (
            "Log in"
          )}
        </Button>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Or continue with
        </FieldSeparator>
        <Field className="grid grid-cols-3 gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => handleOAuth(OAuthStrategy.LinkedIn)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.048c.476-.9 1.637-1.85 3.372-1.85 3.606 0 4.272 2.373 4.272 5.458v6.283zM5.337 7.433a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM6.945 20.452H3.73V9h3.215v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
            </svg>
            <span className="sr-only">Login with LinkedIn</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => handleOAuth(OAuthStrategy.Google)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Login with Google</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => handleOAuth(OAuthStrategy.Facebook)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Login with Meta</span>
          </Button>
        </Field>
        <FieldDescription className="text-center">
          Don&apos;t have an account? <Link to="/sign-up">Sign up</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
