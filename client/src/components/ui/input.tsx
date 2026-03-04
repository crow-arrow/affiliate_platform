import * as React from "react";
import { cn } from "@/lib/utils";
import { applyTypography } from "@/theme";

// Типы пропсов компонента Input
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", autoComplete, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          applyTypography("body-sm"),
          "flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
