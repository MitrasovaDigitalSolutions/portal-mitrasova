"use client"

import type { JSX, ReactNode } from "react"
import type { FieldPath, FieldValues } from "react-hook-form"
import { FormDatePicker } from "./form-date-picker"
import { cn } from "@/lib/utils"

export interface FormDateRangePickerProps<T extends FieldValues> {
  fromName: FieldPath<T>
  toName: FieldPath<T>
  label?: string
  fromPlaceholder?: string
  toPlaceholder?: string
  size?: "sm" | "md" | "lg"
  clearable?: boolean
  disabled?: boolean
  className?: string
  itemClassName?: string
  separator?: ReactNode
}

/**
 * Reusable Form Date Range Picker Component.
 * Komponen form berbasis React Hook Form untuk memilih rentang tanggal (dari - sampai).
 */
export function FormDateRangePicker<T extends FieldValues>({
  fromName,
  toName,
  label,
  fromPlaceholder = "Dari tgl...",
  toPlaceholder = "Sampai tgl...",
  size = "sm",
  clearable = true,
  disabled = false,
  className,
  itemClassName = "w-full sm:w-34 md:w-36",
  separator = "-",
}: FormDateRangePickerProps<T>): JSX.Element {
  return (
    <div className="space-y-1">
      {label && (
        <span className="text-xs font-medium text-foreground">{label}</span>
      )}
      <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
        <div className={itemClassName}>
          <FormDatePicker<T>
            name={fromName}
            placeholder={fromPlaceholder}
            size={size}
            disabled={disabled}
            clearable={clearable}
            buttonClassName="bg-background shadow-2xs"
          />
        </div>
        <span className="text-xs text-muted-foreground select-none">
          {separator}
        </span>
        <div className={itemClassName}>
          <FormDatePicker<T>
            name={toName}
            placeholder={toPlaceholder}
            size={size}
            disabled={disabled}
            clearable={clearable}
            buttonClassName="bg-background shadow-2xs"
          />
        </div>
      </div>
    </div>
  )
}
