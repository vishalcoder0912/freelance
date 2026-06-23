import * as React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost"; size?: "sm" | "md" | "lg" }
>(({ className, variant = "primary", size = "md", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center font-semibold transition-all duration-300 cursor-pointer",
      variant === "primary" && "bg-gold text-premium-black hover:bg-gold/90",
      variant === "outline" && "border border-gold text-gold hover:bg-gold/10",
      variant === "ghost" && "text-gold hover:bg-gold/10",
      size === "sm" && "px-5 py-2 text-sm",
      size === "md" && "px-8 py-3 text-base",
      size === "lg" && "px-10 py-4 text-lg",
      className
    )}
    {...props}
  />
));

export { Button };
