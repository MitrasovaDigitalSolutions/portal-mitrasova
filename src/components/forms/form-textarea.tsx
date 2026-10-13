"use client"

import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { cn } from "@/lib/utils"

interface FormTextareaProps<T extends FieldValues> extends Omit<
  React.ComponentProps<"textarea">,
  "name" | "error"
> {
  name: FieldPath<T>
  label?: string
  required?: boolean
  errorMessage?: string
  error?: string
}

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  required,
  errorMessage,
  error: errorProp,
  className,
  ...props
}: FormTextareaProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>()

  const error = errors[name]
  const displayError =
    errorMessage ??
    (typeof errorProp === "string" ? errorProp : undefined) ??
    (error?.message as string | undefined)

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={name}
          className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
        >
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      )}
      <textarea
        id={name}
        {...register(name)}
        className={cn(
          "min-h-20 w-full resize-none rounded-xl border border-input bg-background p-3 text-xs font-medium text-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none",
          displayError && "border-destructive focus:ring-destructive",
          className
        )}
        aria-invalid={!!displayError}
        {...props}
      />
      {displayError && (
        <p className="text-[10px] font-medium text-destructive">
          {displayError}
        </p>
      )}
    </div>
  )
}
