"use client"

import * as React from "react"
import { ChevronsUpDown, Search, Loader2 } from "lucide-react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"

export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  isLoading?: boolean
  className?: string
  wrapperClassName?: string
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  label?: string
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Pilih opsi...",
  searchPlaceholder = "Cari...",
  emptyMessage = "Tidak ada hasil ditemukan.",
  isLoading = false,
  className,
  wrapperClassName,
  disabled = false,
  size = "sm",
  label,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const selectedValuesSet = React.useMemo(() => new Set(value), [value])

  const filteredOptions = React.useMemo(() => {
    if (!search) {
      return options
    }
    const searchLower = search.toLowerCase()
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchLower)
    )
  }, [options, search])

  const triggerLabel = React.useMemo(() => {
    if (value.length === 0) {
      return placeholder
    }
    if (value.length === options.length && options.length > 0) {
      return "Semua Terpilih"
    }

    if (value.length <= 2) {
      return options
        .filter((opt) => selectedValuesSet.has(opt.value))
        .map((opt) => opt.label)
        .join(", ")
    }

    return `${value.length} Terpilih`
  }, [value, options, selectedValuesSet, placeholder])

  const handleSelect = (optionValue: string) => {
    const newValue = [...value]
    const index = newValue.indexOf(optionValue)
    if (index > -1) {
      newValue.splice(index, 1)
    } else {
      newValue.push(optionValue)
    }
    onChange(newValue)
  }

  const handleSelectAll = () => {
    const allOptionValues = filteredOptions.map((opt) => opt.value)
    const uniqueValues = Array.from(new Set([...value, ...allOptionValues]))
    onChange(uniqueValues)
  }

  const handleClearAll = () => {
    if (!search) {
      onChange([])
    } else {
      const filteredSet = new Set(filteredOptions.map((opt) => opt.value))
      const newValue = value.filter((val) => !filteredSet.has(val))
      onChange(newValue)
    }
  }

  const sizeClasses = {
    sm: "h-8 text-xs font-normal",
    md: "h-10 text-xs font-normal",
    lg: "h-12 text-sm font-normal",
  }[size]

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative w-full max-w-full min-w-0 select-none",
          wrapperClassName
        )}
      >
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          <PopoverPrimitive.Trigger
            render={
              <button
                type="button"
                disabled={disabled}
                title={triggerLabel}
                className={cn(
                  "grid w-full max-w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center overflow-hidden rounded-xl border border-input bg-background px-3 py-1.5 transition-all outline-none hover:bg-accent/50 focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
                  sizeClasses,
                  className
                )}
              >
                <span className="truncate text-left font-medium">
                  {triggerLabel}
                </span>
                <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 shrink-0 justify-self-end text-muted-foreground opacity-50" />
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
              <PopoverPrimitive.Popup className="flex max-h-[320px] w-(--anchor-width) min-w-[200px] origin-(--transform-origin) animate-in flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg duration-100 fade-in-0 outline-none zoom-in-95">
                {/* Search bar */}
                <div className="flex shrink-0 items-center border-b border-border bg-muted/20 px-3 py-1">
                  <Search className="mr-2 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-50" />
                  <input
                    className="flex h-9 w-full rounded-md bg-transparent py-3 text-xs outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Action buttons (Select All / Clear All) */}
                <div className="flex shrink-0 items-center justify-between border-b border-border bg-muted/40 px-3 py-2 text-[10px] font-bold tracking-wide text-muted-foreground">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="cursor-pointer text-primary transition-colors hover:underline"
                  >
                    Pilih Semua
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="cursor-pointer text-destructive transition-colors hover:underline"
                  >
                    {search ? "Bersihkan Hasil" : "Kosongkan"}
                  </button>
                </div>

                {/* Options list */}
                <div className="custom-scrollbar max-h-[180px] flex-1 overflow-x-hidden overflow-y-auto p-1">
                  {isLoading && (
                    <div className="flex items-center justify-center gap-1.5 py-4 text-center text-xs text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      <span>Memuat...</span>
                    </div>
                  )}

                  {!isLoading && filteredOptions.length === 0 && (
                    <div className="py-4 text-center text-xs text-muted-foreground">
                      {emptyMessage}
                    </div>
                  )}

                  {!isLoading &&
                    filteredOptions.map((opt) => {
                      const isChecked = selectedValuesSet.has(opt.value)
                      return (
                        <div
                          key={opt.value}
                          data-disabled={opt.disabled}
                          className={cn(
                            "relative flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
                            isChecked && "bg-primary/10 font-bold text-primary"
                          )}
                          onClick={() =>
                            !opt.disabled && handleSelect(opt.value)
                          }
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="pointer-events-none h-3.5 w-3.5 cursor-pointer rounded border-input text-primary focus:ring-ring"
                          />
                          <span className="min-w-0 flex-1 truncate text-left">
                            {opt.label}
                          </span>
                        </div>
                      )
                    })}
                </div>
              </PopoverPrimitive.Popup>
            </PopoverPrimitive.Positioner>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      </div>
    </div>
  )
}
