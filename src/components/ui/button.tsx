import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline-gold";
  size?:    "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base
          "inline-flex items-center justify-center gap-2 font-body font-medium tracking-wide transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal cursor-pointer",
          // Variants
          variant === "primary"      && "bg-gold-gradient text-obsidian shadow-gold hover:shadow-glow hover:brightness-110",
          variant === "secondary"    && "bg-transparent border border-ash text-pearl hover:border-gold/40 hover:bg-smoke",
          variant === "ghost"        && "bg-transparent text-silver hover:text-pearl hover:bg-smoke",
          variant === "danger"       && "bg-gradient-to-br from-danger to-red-700 text-white hover:brightness-110",
          variant === "outline-gold" && "bg-transparent border border-gold text-gold hover:bg-gold/10",
          // Sizes
          size === "sm"   && "h-8 px-3.5 text-xs rounded-md",
          size === "md"   && "h-10 px-5 text-sm rounded-lg",
          size === "lg"   && "h-12 px-8 text-base rounded-xl",
          size === "icon" && "h-10 w-10 rounded-lg",
          className
        )}
        {...props}
      >
        {loading && (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";
export { Button };
