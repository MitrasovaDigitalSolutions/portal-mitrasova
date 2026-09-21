"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChipsSelectOption {
  value: string
  label: string
}

interface ChipsSelectProps {
  options: ChipsSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  className?: string
  wrapperClassName?: string
  disabled?: boolean
}

export function ChipsSelect({
  options,
  value = [],
  onChange,
  label,
  className,
  wrapperClassName,
  disabled = false,
}: ChipsSelectProps) {
  const toggleOption = (val: string) => {
    if (disabled) {
      return
    }
    const newValue = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val]
    onChange(newValue)
  }

  return (
    <div className={cn("w-full space-y-1.5", wrapperClassName)}>
      {label && (
        <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          {label}
        </label>
      )}
      <div className={cn("flex flex-wrap gap-2", className)}>
        {options.map((option) => {
          const isSelected = value.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => toggleOption(option.value)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all select-none",
                isSelected
                  ? "border-primary bg-primary font-semibold text-primary-foreground shadow-xs"
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {isSelected && <Check className="h-3 w-3 stroke-[3px]" />}
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
