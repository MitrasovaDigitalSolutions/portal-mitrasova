"use client"

import {
  useFormContext,
  Controller,
  type FieldPath,
  type FieldValues,
  type FieldError,
  type FieldErrors,
} from "react-hook-form"
import {
  RadioChips,
  type RadioChipOption,
  type RadioChipsProps,
} from "@/components/ui/radio-chips"
import { cn } from "@/lib/utils"

export interface FormRadioChipsProps<T extends FieldValues> extends Omit<
  RadioChipsProps,
  "value" | "onChange" | "error"
> {
  id?: string
  name: FieldPath<T>
  errorMessage?: string
  error?: string
  onChange?: (value: string) => void
}

export function FormRadioChips<T extends FieldValues>({
  id,
  name,
  label,
  required,
  errorMessage,
  error: errorProp,
  options,
  onChange,
  variant = "segmented",
  size = "sm",
  className,
  wrapperClassName,
  disabled,
  columns,
}: FormRadioChipsProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const getNestedError = (
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

  const error = getNestedError(errors, name)
  const displayError =
    errorMessage ??
    (typeof errorProp === "string" ? errorProp : undefined) ??
    error?.message

  return (
    <div id={id} className={cn("w-full space-y-1.5", wrapperClassName)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioChips
            options={options}
            value={
              field.value !== undefined && field.value !== null
                ? String(field.value)
                : ""
            }
            onChange={(val) => {
              const parsed =
                typeof field.value === "boolean" ? val === "true" : val
              field.onChange(parsed)
              if (onChange) {
                onChange(val)
              }
            }}
            label={label}
            required={required}
            disabled={disabled}
            variant={variant}
            size={size}
            columns={columns}
            className={className}
          />
        )}
      />
      {displayError && (
        <p className="text-[10px] font-medium text-destructive">
          {displayError}
        </p>
      )}
    </div>
  )
}

export type { RadioChipOption }
