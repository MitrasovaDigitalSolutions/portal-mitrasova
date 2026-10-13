"use client"

import {
  useFormContext,
  type FieldPath,
  type FieldValues,
  Controller,
  type FieldError,
  type FieldErrors,
} from "react-hook-form"
import { NominalInput } from "@/components/ui/nominal-input"
import React from "react"

interface FormNominalInputProps<T extends FieldValues> extends Omit<
  React.ComponentProps<typeof NominalInput>,
  "name" | "value" | "onChange" | "isError" | "required"
> {
  name: FieldPath<T>
  label?: string
  required?: boolean
  errorMessage?: string
  error?: string
  onValueChange?: (val: number | null) => void
  inputRef?: React.Ref<HTMLInputElement>
}

export function FormNominalInput<T extends FieldValues>({
  name,
  label,
  required,
  errorMessage,
  error: errorProp,
  className,
  disabled,
  onValueChange,
  inputRef,
  ...props
}: FormNominalInputProps<T>) {
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
  const displayError =
    errorMessage ??
    (typeof errorProp === "string" ? errorProp : undefined) ??
    (error?.message as string | undefined)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
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
          <NominalInput
            id={name}
            name={name}
            value={value}
            inputRef={inputRef}
            onValueChange={(val) => {
              onChange(val)
              onValueChange?.(val)
            }}
            disabled={disabled}
            isError={!!displayError}
            className={className}
            {...props}
          />
          {displayError && (
            <p className="text-[10px] font-medium text-destructive">
              {displayError}
            </p>
          )}
        </div>
      )}
    />
  )
}
