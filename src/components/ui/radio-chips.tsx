"use client"

import * as React from "react"
import { Check, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface RadioChipOption {
  value: string
  label: string
  icon?: React.ReactNode
  description?: string
  badge?: string
  disabled?: boolean
  tooltip?: string
}

export interface RadioChipsProps {
  options: RadioChipOption[]
  value?: string
  onChange?: (value: string) => void
  label?: string
  className?: string
  wrapperClassName?: string
  disabled?: boolean
  variant?: "chips" | "segmented" | "cards" | "radio"
  size?: "xs" | "sm" | "md" | "lg"
  columns?: number
}

export function RadioChips({
  options,
  value,
  onChange,
  label,
  className,
  wrapperClassName,
  disabled = false,
  variant = "segmented",
  size = "sm",
  columns,
}: RadioChipsProps) {
  const handleSelect = (val: string) => {
    if (disabled) {
      return
    }
    onChange?.(val)
  }

  const sizeClasses = {
    xs: "py-0.5 px-1.5 text-[10px]",
    sm: "py-1 px-2 text-[11px]",
    md: "py-1.5 px-2.5 text-xs",
    lg: "py-2.5 px-4 text-sm",
  }[size]

  return (
    <div className={cn("w-full space-y-1", wrapperClassName)}>
      {label && (
        <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          {label}
        </label>
      )}

      {variant === "segmented" && (
        <div
          className={cn(
            "flex h-9 items-center gap-0.5 rounded-xl border border-border bg-muted p-0.5",
            columns ? `grid grid-cols-${columns}` : "flex flex-nowrap",
            className
          )}
        >
          {options.map((option) => {
            const isSelected = value === option.value
            const isOptionDisabled = disabled || option.disabled

            return (
              <button
                key={option.value}
                type="button"
                disabled={isOptionDisabled}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex h-7.5 flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg border leading-none font-semibold transition-all duration-150 select-none",
                  sizeClasses,
                  isSelected
                    ? "border-border bg-background text-foreground shadow-xs"
                    : "border-transparent bg-transparent text-muted-foreground hover:bg-background/50 hover:text-foreground",
                  isOptionDisabled &&
                    "pointer-events-none cursor-not-allowed opacity-50"
                )}
              >
                {option.icon && (
                  <span
                    className={cn(
                      "shrink-0",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {option.icon}
                  </span>
                )}
                <span className="truncate">{option.label}</span>
                {option.badge && (
                  <span className="py-0.2 rounded-full bg-muted px-1 text-[9px] font-bold text-muted-foreground">
                    {option.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {variant === "chips" && (
        <div
          className={cn(
            "flex flex-wrap gap-1.5",
            columns && `grid grid-cols-${columns}`,
            className
          )}
        >
          {options.map((option) => {
            const isSelected = value === option.value
            const isOptionDisabled = disabled || option.disabled

            return (
              <button
                key={option.value}
                type="button"
                disabled={isOptionDisabled}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-full border font-semibold transition-all select-none",
                  sizeClasses,
                  isSelected
                    ? "border-primary bg-primary font-bold text-primary-foreground shadow-xs"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                  isOptionDisabled &&
                    "pointer-events-none cursor-not-allowed opacity-50"
                )}
              >
                {isSelected ? (
                  <Check className="h-3 w-3 shrink-0 stroke-[3px]" />
                ) : (
                  option.icon && (
                    <span className="shrink-0 text-muted-foreground">
                      {option.icon}
                    </span>
                  )
                )}
                <span className="truncate">{option.label}</span>
                {option.badge && (
                  <span className="py-0.2 rounded-full bg-muted px-1.5 text-[9px] font-bold text-muted-foreground">
                    {option.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {variant === "cards" && (
        <div
          className={cn(
            "grid gap-2",
            columns ? `grid-cols-${columns}` : "grid-cols-1 sm:grid-cols-3",
            className
          )}
        >
          {options.map((option) => {
            const isSelected = value === option.value
            const isOptionDisabled = disabled || option.disabled

            return (
              <button
                key={option.value}
                type="button"
                disabled={isOptionDisabled}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "relative flex cursor-pointer flex-col justify-between rounded-xl border p-3 text-left transition-all select-none",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground shadow-xs ring-1 ring-primary/30"
                    : "border-border bg-card text-card-foreground hover:border-ring/50 hover:bg-muted/50",
                  isOptionDisabled &&
                    "pointer-events-none cursor-not-allowed opacity-50"
                )}
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {option.icon && (
                      <span
                        className={cn(
                          "shrink-0",
                          isSelected ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {option.icon}
                      </span>
                    )}
                    <span className="text-xs font-bold">{option.label}</span>
                  </div>
                  {isSelected && (
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-2.5 w-2.5 stroke-[3px]" />
                    </div>
                  )}
                </div>
                {option.description && (
                  <p className="text-[10px] leading-snug text-muted-foreground">
                    {option.description}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      )}

      {variant === "radio" && (
        <div
          className={cn(
            "flex flex-wrap items-center gap-4",
            columns && `grid grid-cols-${columns}`,
            className
          )}
        >
          {options.map((option) => {
            const isSelected = value === option.value
            const isOptionDisabled = disabled || option.disabled

            const optionElement = (
              <button
                key={option.value}
                type="button"
                disabled={isOptionDisabled}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "group flex cursor-pointer items-center gap-2 py-1 text-left text-xs font-medium transition-colors select-none",
                  isSelected
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  isOptionDisabled &&
                    "pointer-events-none cursor-not-allowed opacity-50"
                )}
              >
                <div
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all",
                    isSelected
                      ? "border-primary bg-primary shadow-xs"
                      : "border-input bg-background group-hover:border-ring"
                  )}
                >
                  {isSelected && (
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {option.icon && <span>{option.icon}</span>}
                  <span>{option.label}</span>
                  {option.badge && (
                    <span className="py-0.2 rounded-full bg-muted px-1.5 text-[9px] font-bold text-muted-foreground">
                      {option.badge}
                    </span>
                  )}
                </div>
              </button>
            )

            if (option.tooltip) {
              return (
                <TooltipProvider key={option.value} delayDuration={150}>
                  <Tooltip>
                    <div className="flex items-center gap-1">
                      {optionElement}
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="cursor-pointer rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Info className="size-3" />
                        </button>
                      </TooltipTrigger>
                    </div>
                    <TooltipContent
                      side="top"
                      className="z-[100] max-w-xs text-[11px] leading-relaxed"
                    >
                      {option.tooltip}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            }

            return optionElement
          })}
        </div>
      )}
    </div>
  )
}
