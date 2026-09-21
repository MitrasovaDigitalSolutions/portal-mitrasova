"use client"

import { useCallback } from "react"
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FormInputProps<T extends FieldValues> extends Omit<
  React.ComponentProps<typeof Input>,
  "name"
> {
  name: FieldPath<T>
  label?: string
  wrapperId?: string
  inputRef?: React.Ref<HTMLInputElement>
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
      <Input
        id={name}
        ref={handleRef}
        {...registerProps}
        className={cn(
          "h-10 rounded-xl border-input bg-background text-xs text-foreground focus-visible:ring-ring",
          error && "border-destructive focus-visible:ring-destructive",
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
