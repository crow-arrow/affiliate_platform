import { Link } from "react-router-dom";
import { BusinessSignupForm } from "@/components/business-signup-form";
import logo from "@/assets/jinn.svg";
import uzbekistan from "@/assets/uzbekistan-lady.jpg";
import placeholder from "@/assets/placeholder.svg";

export function BusinessSignUpPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-8 w-8 p-2 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <img src={logo} alt="Logo" />
            </div>
            Jinn Limited
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <BusinessSignupForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={uzbekistan || placeholder}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}


