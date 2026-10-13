"use client"

import type { JSX, ReactNode } from "react"
import { DatePicker } from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"

export interface DateRangeFilterProps {
  dateFrom?: string | null
  dateTo?: string | null
  onDateFromChange: (val: string) => void
  onDateToChange: (val: string) => void
  fromPlaceholder?: string
  toPlaceholder?: string
  size?: "sm" | "md" | "lg"
  className?: string
  itemClassName?: string
  disabled?: boolean
  clearable?: boolean
  separator?: ReactNode
}

/**
 * Reusable Date Range Filter Component.
 * Menampilkan sepasang date picker terhubung untuk rentang tanggal (dari - sampai).
 */
export function DateRangeFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  fromPlaceholder = "Dari tgl...",
  toPlaceholder = "Sampai tgl...",
  size = "sm",
  className,
  itemClassName = "w-full sm:w-34 md:w-36",
  disabled = false,
  clearable = true,
  separator = "-",
}: DateRangeFilterProps): JSX.Element {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <div className={itemClassName}>
        <DatePicker
          value={dateFrom}
          onChange={onDateFromChange}
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
        <DatePicker
          value={dateTo}
          onChange={onDateToChange}
          placeholder={toPlaceholder}
          size={size}
          disabled={disabled}
          clearable={clearable}
          buttonClassName="bg-background shadow-2xs"
        />
      </div>
    </div>
  )
}
