"use client"

import { useState } from "react"
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type FieldError,
  type FieldErrors,
  useFormContext,
} from "react-hook-form"
import { Check, ChevronsUpDown, Search, Loader2, X } from "lucide-react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"
import type { CommandOption } from "@/components/ui/command-select"

export interface MultiSelectOption {
  value: string
  label: string
  description?: string
  badge?: string
  disabled?: boolean
}

export interface FormMultiSelectProps<T extends FieldValues> {
  name: FieldPath<T>
  label?: string
  options: (MultiSelectOption | CommandOption)[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  isLoading?: boolean
  className?: string
  wrapperClassName?: string
  disabled?: boolean
  selectAllText?: string
  size?: "sm" | "md" | "lg"
  maxLabelLength?: number
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
  onChange?: (value: string[]) => void
}

export function FormMultiSelect<T extends FieldValues>({
  name,
  label,
  options,
  placeholder = "Pilih opsi...",
  searchPlaceholder = "Cari opsi...",
  emptyMessage = "Tidak ada data.",
  isLoading = false,
  className,
  wrapperClassName,
  disabled = false,
  selectAllText,
  size = "md",
  maxLabelLength,
  leftIcon,
  rightElement,
  onChange: propsOnChange,
}: FormMultiSelectProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  const effectiveSelectAllText =
    selectAllText || (placeholder !== "Pilih opsi..." ? placeholder : undefined)

  const filteredOptions = options.filter((opt) => {
    if (!search.trim()) {
      return true
    }
    const q = search.trim().toLowerCase()
    return (
      opt.label.toLowerCase().includes(q) ||
      opt.value.toLowerCase().includes(q) ||
      (opt.description && opt.description.toLowerCase().includes(q))
    )
  })

  const sizeClasses = {
    sm: "h-8 text-xs font-normal text-foreground",
    md: "h-10 text-xs font-normal text-foreground",
    lg: "h-12 text-sm font-normal text-foreground",
  }[size]

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

  return (
    <div className={cn("w-full space-y-1.5", wrapperClassName)}>
      {label && (
        <label
          htmlFor={name}
          className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
        >
          {label}
        </label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => {
          const selectedValues: string[] = Array.isArray(value) ? value : []
          const isAllSelected = selectedValues.length === 0

          const handleToggleOption = (val: string) => {
            let updated: string[]
            if (selectedValues.includes(val)) {
              updated = selectedValues.filter((v) => v !== val)
            } else {
              updated = [...selectedValues, val]
            }
            onChange(updated)
            if (propsOnChange) {
              propsOnChange(updated)
            }
          }

          const handleClearAll = (e: React.MouseEvent) => {
            e.stopPropagation()
            onChange([])
            if (propsOnChange) {
              propsOnChange([])
            }
          }

          const getDisplayLabel = () => {
            if (isAllSelected) {
              return effectiveSelectAllText || placeholder
            }
            if (selectedValues.length === 1) {
              const match = options.find((o) => o.value === selectedValues[0])
              const labelStr = match?.label || selectedValues[0]
              if (maxLabelLength && labelStr.length > maxLabelLength) {
                return labelStr.substring(0, maxLabelLength) + "..."
              }
              return labelStr
            }
            return `${selectedValues.length} Dipilih`
          }

          return (
            <div className="relative w-full max-w-full min-w-0">
              <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
                <PopoverPrimitive.Trigger
                  render={
                    <button
                      type="button"
                      disabled={disabled}
                      className={cn(
                        "flex w-full max-w-full cursor-pointer items-center justify-between gap-2 overflow-hidden rounded-xl border border-input bg-background px-3 py-1.5 transition-all outline-none hover:bg-muted/40 focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
                        isOpen && "border-ring ring-2 ring-ring/20",
                        error &&
                          "border-destructive focus:border-destructive focus:ring-destructive/20",
                        sizeClasses,
                        className
                      )}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                        {leftIcon && (
                          <span className="shrink-0">{leftIcon}</span>
                        )}
                        <span
                          className={cn(
                            "truncate text-left",
                            isAllSelected
                              ? "font-normal text-muted-foreground"
                              : "font-medium text-foreground"
                          )}
                        >
                          {getDisplayLabel()}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        {!isAllSelected && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={handleClearAll}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault()
                                handleClearAll(e as unknown as React.MouseEvent)
                              }
                            }}
                            className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="Reset Opsi"
                          >
                            <X size={12} />
                          </span>
                        )}
                        {rightElement}
                        <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-50" />
                      </div>
                    </button>
                  }
                />

                <PopoverPrimitive.Portal>
                  <PopoverPrimitive.Positioner
                    align="start"
                    side="bottom"
                    sideOffset={4}
                    className="isolate z-[100000]"
                  >
                    <PopoverPrimitive.Popup className="max-h-[300px] w-(--anchor-width) min-w-[200px] origin-(--transform-origin) animate-in overflow-hidden duration-100 fade-in-0 outline-none zoom-in-95">
                      <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-md">
                        {/* Search header */}
                        <div className="flex items-center border-b border-border bg-muted/20 px-3 py-1">
                          <Search className="mr-2 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-50" />
                          <input
                            type="text"
                            className="flex h-9 w-full rounded-md bg-transparent py-3 text-xs outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                          />
                        </div>

                        {/* Options List */}
                        <div className="custom-scrollbar max-h-[200px] space-y-0.5 overflow-x-hidden overflow-y-auto p-1">
                          {isLoading && (
                            <div className="flex items-center justify-center gap-1.5 py-4 text-center text-xs text-muted-foreground">
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                              <span>Memuat data...</span>
                            </div>
                          )}

                          {!isLoading && filteredOptions.length === 0 && (
                            <div className="py-4 text-center text-xs text-muted-foreground">
                              {emptyMessage}
                            </div>
                          )}

                          {!isLoading && (
                            <>
                              {effectiveSelectAllText && !search.trim() && (
                                <div
                                  onClick={() => {
                                    onChange([])
                                    if (propsOnChange) {
                                      propsOnChange([])
                                    }
                                  }}
                                  className={cn(
                                    "relative flex cursor-pointer items-center rounded-lg px-2.5 py-1.5 text-xs transition-colors outline-none select-none hover:bg-muted hover:text-foreground",
                                    isAllSelected &&
                                      "bg-primary/10 font-bold text-primary"
                                  )}
                                >
                                  {isAllSelected && (
                                    <Check className="mr-2 h-3.5 w-3.5 shrink-0 text-primary" />
                                  )}
                                  <div
                                    className={cn(
                                      "min-w-0 flex-1 text-left font-medium",
                                      !isAllSelected && "pl-[22px]"
                                    )}
                                  >
                                    {effectiveSelectAllText}
                                  </div>
                                </div>
                              )}

                              {filteredOptions.map((opt, idx) => {
                                const isSelected = selectedValues.includes(
                                  opt.value
                                )
                                const truncatedLabel =
                                  maxLabelLength &&
                                  opt.label.length > maxLabelLength
                                    ? opt.label.substring(0, maxLabelLength) +
                                      "..."
                                    : opt.label
                                return (
                                  <div
                                    key={`${opt.value}-${idx}`}
                                    onClick={() =>
                                      handleToggleOption(opt.value)
                                    }
                                    className={cn(
                                      "relative flex cursor-pointer items-center rounded-lg px-2.5 py-1.5 text-xs transition-colors outline-none select-none hover:bg-muted hover:text-foreground",
                                      isSelected &&
                                        "bg-primary/10 font-bold text-primary"
                                    )}
                                  >
                                    {isSelected && (
                                      <Check className="mr-2 h-3.5 w-3.5 shrink-0 text-primary" />
                                    )}
                                    <div
                                      className={cn(
                                        "flex min-w-0 flex-1 items-center justify-between gap-2 text-left",
                                        !isSelected && "pl-[22px]"
                                      )}
                                    >
                                      <div className="flex min-w-0 flex-1 items-center gap-1.5">
                                        {opt.badge && (
                                          <span className="shrink-0 rounded bg-primary px-1 font-mono text-[9px] font-bold text-primary-foreground">
                                            {opt.badge}
                                          </span>
                                        )}
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                          <span className="block truncate font-semibold text-foreground">
                                            {truncatedLabel}
                                          </span>
                                          {opt.description && (
                                            <span className="block truncate text-[10px] font-normal text-muted-foreground">
                                              {opt.description}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </>
                          )}
                        </div>
                      </div>
                    </PopoverPrimitive.Popup>
                  </PopoverPrimitive.Positioner>
                </PopoverPrimitive.Portal>
              </PopoverPrimitive.Root>
            </div>
          )
        }}
      />
      {error && (
        <p className="text-[10px] font-medium text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}
