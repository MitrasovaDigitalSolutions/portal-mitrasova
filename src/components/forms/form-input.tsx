"use client"

import { useCallback } from "react"
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface FormInputProps<T extends FieldValues> extends Omit<
  React.ComponentProps<typeof Input>,
  "name"
> {
  name: FieldPath<T>
  label?: string
  wrapperId?: string
  inputRef?: React.Ref<HTMLInputElement>
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value)
  } else if (ref && typeof ref === "object" && "current" in ref) {
    ;(ref as React.MutableRefObject<T | null>).current = value
  }
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  wrapperId,
  className,
  required,
  inputRef,
  startIcon,
  endIcon,
  ...props
}: FormInputProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>()

  const error = errors[name]
  const { ref: registerRef, ...registerProps } = register(name)

  const handleRef = useCallback(
    (node: HTMLInputElement | null) => {
      registerRef(node)
      setRef(inputRef, node)
    },
    [registerRef, inputRef]
  )

  return (
    <div id={wrapperId} className="space-y-1.5">
      {label && (
        <label
          htmlFor={name}
          className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
        >
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      )}
      <div className="relative">
        {startIcon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center justify-center">
            {startIcon}
          </span>
        )}
        <Input
          id={name}
          ref={handleRef}
          {...registerProps}
          className={cn(
            "h-10 rounded-xl border-input bg-background text-xs text-foreground focus-visible:ring-ring",
            startIcon && "pl-10",
            endIcon && "pr-10",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {endIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
            {endIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[10px] font-medium text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  )
}
