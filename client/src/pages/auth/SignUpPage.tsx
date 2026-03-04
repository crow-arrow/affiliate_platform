import { SignupForm } from "@/components/signup-form";
import { Typography } from "@/theme";
import { cn } from "@/lib/utils";

import { Link } from "react-router-dom";
import placeholder from "@/assets/placeholder.svg";
import uzbekistan from "@/assets/uzbekistan-lady.jpg";
import logo from "@/assets/jinn.svg";

export function SignUpPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-lg md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Typography.body
            {...({ as: Link, to: "/" } as any)}
            className="flex items-center gap-2 font-medium focus-ring"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground p-1">
              <img src={logo} alt="Logo" className="h-full w-full object-contain" />
            </div>
            Jinn Limited
          </Typography.body>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={uzbekistan || placeholder}
          alt="Image"
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            !uzbekistan && "dark:brightness-[0.2] dark:grayscale"
          )}
        />
      </div>
    </div>
  );
}
