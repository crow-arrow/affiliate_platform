import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { applyTypography } from "@/theme";
import { cn } from "@/lib/utils";

// Варианты стиля для label
const labelVariants = cva(
  applyTypography("label", "leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70")
);

// Типы пропсов для Label
export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
  )
);

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
