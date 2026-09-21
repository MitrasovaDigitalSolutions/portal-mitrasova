"use client"

import { NumberInput } from "@/components/ui/number-input"
import { cn } from "@/lib/utils"
import React from "react"
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
  type FieldError,
  type FieldErrors,
} from "react-hook-form"

interface FormNumberInputProps<T extends FieldValues> extends Omit<
  React.ComponentProps<typeof NumberInput>,
  "name" | "value" | "onChange"
> {
  name: FieldPath<T>
  label?: React.ReactNode
  helperText?: React.ReactNode
  onValueChange?: (val: number | null) => void
  inputRef?: React.Ref<HTMLInputElement>
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value)
  } else if (ref && typeof ref === "object" && "current" in ref) {
    ;(ref as React.MutableRefObject<T | null>).current = value
  }
}

export function FormNumberInput<T extends FieldValues>({
  name,
  label,
  helperText,
  className,
  disabled,
  onValueChange,
  onBlur,
  inputRef,
  ...props
}: FormNumberInputProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const getNestedValue = (
    obj: FieldErrors<T>,
    path: string
  ): FieldError | undefined => {
    const value = path
      .split(/[.[\]]+/)
      .filter(Boolean)
      .reduce<unknown>((prev, curr) => {
        if (prev && typeof prev === "object") {
          return (prev as Record<string, unknown>)[curr]
        }
        return undefined
      }, obj)
    return value as FieldError | undefined
  }

  const error = getNestedValue(errors, name)

  const handleRef = React.useCallback(
    (
      node: HTMLInputElement | null,
      fieldRef: (instance: HTMLInputElement | null) => void
    ) => {
      fieldRef(node)
      setRef(inputRef, node)
    },
    [inputRef]
  )

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, ref } }) => {
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
            <NumberInput
              id={name}
              ref={(node) => handleRef(node, ref)}
              value={value}
              onChange={(val) => {
                onChange(val)
                onValueChange?.(val)
              }}
              onBlur={onBlur}
              disabled={disabled}
              className={cn(
                "h-10 rounded-xl border-input text-xs focus-visible:ring-ring disabled:border-input disabled:bg-muted disabled:text-muted-foreground",
                error && "border-destructive focus-visible:ring-destructive",
                className
              )}
              aria-invalid={!!error}
              {...props}
            />
            {helperText && !error && (
              <div className="mt-0.5 text-xs text-muted-foreground">
                {helperText}
              </div>
            )}
            {error && (
              <p className="text-[10px] font-medium text-destructive">
                {error.message as string}
              </p>
            )}
          </div>
        )
      }}
    />
  )
}
