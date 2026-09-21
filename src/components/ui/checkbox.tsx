"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, checked = false, onCheckedChange, disabled, ...props },
    ref
  ) => {
    return (
      <label
        className={cn(
          "relative inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border transition-all duration-150 select-none",
          checked
            ? "border-primary bg-primary text-primary-foreground shadow-xs"
            : "border-input bg-background text-foreground hover:border-ring dark:bg-card",
          disabled && "cursor-not-allowed opacity-40",
          className
        )}
      >
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only"
          {...props}
        />
        {checked && <Check className="h-3 w-3 stroke-[3]" />}
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
