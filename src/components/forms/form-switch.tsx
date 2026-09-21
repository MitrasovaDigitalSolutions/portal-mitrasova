"use client"

import {
  useFormContext,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface FormSwitchProps<T extends FieldValues> {
  name: FieldPath<T>
  label: string
  description?: string
  className?: string
  disabled?: boolean
}

export function FormSwitch<T extends FieldValues>({
  name,
  label,
  description,
  className,
  disabled,
}: FormSwitchProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3.5",
        className
      )}
    >
      <div className="space-y-0.5 pr-4">
        <label
          htmlFor={`switch-${name}`}
          className="block cursor-pointer text-xs font-bold text-foreground select-none"
        >
          {label}
        </label>
        {description && (
          <p className="text-[10px] leading-snug text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Switch
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
            id={`switch-${name}`}
          />
        )}
      />
    </div>
  )
}
