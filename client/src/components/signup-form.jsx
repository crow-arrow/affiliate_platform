import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  logout,
  clearErrors,
} from "../redux/features/auth/authSlice";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  const loading = status === "loading";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await dispatch(
        registerUser({
          email,
          username: email,
          phone,
          first_name: firstName,
          last_name: lastName,
          password,
        })
      ).unwrap();

      setEmail("");
      setPhone("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setConfirmPassword("");
      navigate("/email-verification", { state: { email } });
    } catch (errors) {
      if (errors && Array.isArray(errors) && errors.length > 0) {
        toast.error(errors[0].message || "Server error");
        dispatch(clearErrors());
      }
    }
  };

  const formFields = [
    {
      label: "First Name",
      type: "text",
      placeholder: "Will",
      autoComplete: "given-name",
      value: firstName,
      setValue: setFirstName,
      id: "firstName",
      gridCol: "col-span-1",
    },
    {
      label: "Last Name",
      type: "text",
      placeholder: "Smith",
      autoComplete: "family-name",
      value: lastName,
      setValue: setLastName,
      id: "lastName",
      gridCol: "col-span-1",
    },
    {
      label: "Phone Number",
      type: "tel",
      placeholder: "+49 (151) 290-175-33",
      autoComplete: "tel",
      value: phone,
      setValue: setPhone,
      id: "phone",
    },
    {
      label: "Email",
      type: "email",
      placeholder: "exemple@jinn-travel.com",
      autoComplete: "email",
      value: email,
      setValue: setEmail,
      id: "email",
    },
    {
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      autoComplete: "new-password",
      value: password,
      setValue: setPassword,
      id: "password",
    },
    {
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm your password",
      autoComplete: "new-password",
      value: confirmPassword,
      setValue: setConfirmPassword,
      id: "confirmPassword",
    },
  ];

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Join our community!</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Create your account to get started
        </p>
      </div>

      <div className="grid gap-4">
        {formFields.map((field, index) => {
          // Check if this is firstName and we need to start a grid row
          const isFirstName = field.id === "firstName";
          const isLastName = field.id === "lastName";

          if (isFirstName) {
            // Render firstName and lastName together in a grid
            const lastNameField = formFields[index + 1];
            return (
              <div key="name-fields" className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    value={field.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={lastNameField.id}>
                    {lastNameField.label}
                  </Label>
                  <Input
                    id={lastNameField.id}
                    type={lastNameField.type}
                    placeholder={lastNameField.placeholder}
                    autoComplete={lastNameField.autoComplete}
                    value={lastNameField.value}
                    onChange={(e) => lastNameField.setValue(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            );
          }

          // Skip lastName since it's already rendered with firstName
          if (isLastName) {
            return null;
          }

          // Render other fields normally
          return (
            <div key={field.id} className="grid gap-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          );
        })}

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? (
            <>
              <svg
                aria-hidden="true"
                className="inline w-4 h-4 me-3 text-current animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Loading...
            </>
          ) : (
            "Sign up"
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Button variant="outline" className="w-full bg-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Login with Apple</span>
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Login with Google</span>
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Login with Meta</span>
          </Button>
        </div>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link
          to="/sign-in"
          className="underline underline-offset-4 hover:text-primary"
        >
          Login here
        </Link>
      </div>
    </form>
  );
}

SignupForm.propTypes = {
  className: PropTypes.string,
};
