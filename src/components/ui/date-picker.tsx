"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar as CalendarIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DatePickerProps {
  value?: string | Date | null
  onChange?: (date: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  buttonClassName?: string
  wrapperClassName?: string
  error?: string
  label?: string
  clearable?: boolean
  size?: "sm" | "md" | "lg"
  captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years"
  startMonth?: Date
  endMonth?: Date
  reverseYears?: boolean
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Pilih tanggal...",
      disabled = false,
      className,
      buttonClassName,
      wrapperClassName,
      error,
      label,
      clearable = true,
      size = "md",
      captionLayout = "dropdown",
      startMonth,
      endMonth,
      reverseYears,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)

    const sizeClasses = {
      sm: "h-8 text-xs font-normal px-2.5",
      md: "h-10 text-xs font-normal px-3",
      lg: "h-12 text-sm font-normal px-4",
    }[size]

    const selectedDate = React.useMemo(() => {
      if (!value) {
        return undefined
      }
      if (value instanceof Date) {
        return isValid(value) ? value : undefined
      }
      let parsed = parse(value, "yyyy-MM-dd", new Date())
      if (isValid(parsed)) {
        return parsed
      }
      parsed = new Date(value)
      return isValid(parsed) ? parsed : undefined
    }, [value])

    const [month, setMonth] = React.useState<Date | undefined>(
      selectedDate || new Date()
    )

    React.useEffect(() => {
      if (open) {
        setMonth(selectedDate || new Date())
      }
    }, [open, selectedDate])

    const defaultStartMonth = React.useMemo(
      () => new Date(new Date().getFullYear() - 100, 0),
      []
    )
    const defaultEndMonth = React.useMemo(
      () => new Date(new Date().getFullYear() + 20, 11),
      []
    )

    const resolvedStartMonth = startMonth || defaultStartMonth
    const resolvedEndMonth = endMonth || defaultEndMonth

    const handleSelect = (date: Date | undefined) => {
      if (!date) {
        onChange?.("")
      } else {
        onChange?.(format(date, "yyyy-MM-dd"))
      }
      setOpen(false)
    }

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange?.("")
    }

    return (
      <div className={cn("w-full space-y-1.5", wrapperClassName || className)}>
        {label && (
          <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            {label}
          </label>
        )}

        <div className="relative w-full">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <button
                  ref={ref}
                  type="button"
                  disabled={disabled}
                  className={cn(
                    "relative flex w-full cursor-pointer items-center justify-start overflow-hidden rounded-xl border border-input bg-background pr-10 text-left transition-all outline-none hover:border-primary/50 hover:bg-accent/50 focus:border-ring focus:ring-2 focus:ring-ring/20",
                    sizeClasses,
                    !selectedDate && "text-muted-foreground",
                    error &&
                      "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20",
                    disabled &&
                      "pointer-events-none cursor-not-allowed bg-muted opacity-50",
                    buttonClassName
                  )}
                  {...props}
                >
                  <CalendarIcon
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0 text-muted-foreground transition-colors",
                      selectedDate && "text-primary"
                    )}
                  />
                  <span className="truncate">
                    {selectedDate ? (
                      format(selectedDate, "dd MMMM yyyy", { locale: id })
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </span>
                </button>
              }
            />
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelect}
                month={month}
                onMonthChange={setMonth}
                className="p-3 w-[280px]"
                captionLayout={captionLayout}
                startMonth={resolvedStartMonth}
                endMonth={resolvedEndMonth}
                reverseYears={reverseYears}
              />
            </PopoverContent>
          </Popover>

          {clearable && selectedDate && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {error && (
          <p className="text-[10px] font-medium text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

DatePicker.displayName = "DatePicker"
