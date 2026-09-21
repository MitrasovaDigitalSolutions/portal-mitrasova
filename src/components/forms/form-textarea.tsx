"use client"

import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { cn } from "@/lib/utils"

interface FormTextareaProps<T extends FieldValues> extends Omit<
  React.ComponentProps<"textarea">,
  "name"
> {
  name: FieldPath<T>
  label?: string
}

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  className,
  ...props
}: FormTextareaProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>()

  const error = errors[name]

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={name}
          className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        {...register(name)}
        className={cn(
          "min-h-20 w-full resize-none rounded-xl border border-input bg-background p-3 text-xs font-medium text-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none",
          error && "border-destructive focus:ring-destructive",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p className="text-[10px] font-medium text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  )
}
