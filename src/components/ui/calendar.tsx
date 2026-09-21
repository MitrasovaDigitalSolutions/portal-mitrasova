"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  useDayPicker,
  type DropdownProps,
  type MonthCaptionProps,
} from "react-day-picker"
import { id as idLocale } from "date-fns/locale"

import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

function CalendarDropdown({ value, onChange, options }: DropdownProps) {
  const selectedOption = options?.find((opt) => opt.value === value)

  const handleValueChange = (newValue: string | null) => {
    if (newValue === null) {
      return
    }
    const syntheticEvent = {
      target: {
        value: newValue,
      },
    } as React.ChangeEvent<HTMLSelectElement>
    onChange?.(syntheticEvent)
  }

  return (
    <Select value={value?.toString()} onValueChange={handleValueChange}>
      <SelectTrigger
        size="sm"
        className="h-7 cursor-pointer items-center justify-between gap-1 rounded-md border border-input bg-background/60 px-2 py-0.5 text-xs font-semibold text-foreground transition-colors select-none hover:bg-accent hover:text-accent-foreground shadow-xs focus:ring-0 focus:ring-offset-0 [&_svg]:size-3 [&_svg]:text-muted-foreground/70"
      >
        <SelectValue>{selectedOption?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent className="z-[100] max-h-[260px] min-w-[120px] overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md">
        {options?.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value.toString()}
            disabled={option.disabled}
            className="cursor-pointer rounded-md px-2 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground focus:bg-accent"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function CalendarMonthCaption({
  displayIndex,
  calendarMonth: _calendarMonth,
  children,
  className,
  ...props
}: MonthCaptionProps) {
  const {
    goToMonth,
    previousMonth,
    nextMonth,
    months,
    labels: { labelPrevious, labelNext },
    dayPickerProps: { onPrevClick, onNextClick, hideNavigation },
  } = useDayPicker()

  const isFirstMonth = displayIndex === 0
  const isLastMonth = displayIndex === months.length - 1

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (previousMonth) {
      goToMonth(previousMonth)
      onPrevClick?.(previousMonth)
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (nextMonth) {
      goToMonth(nextMonth)
      onNextClick?.(nextMonth)
    }
  }

  return (
    <div
      className={cn(
        "flex h-8 w-full items-center justify-between gap-1 mb-2 select-none",
        className
      )}
      {...props}
    >
      {!hideNavigation && isFirstMonth ? (
        <button
          type="button"
          aria-label={labelPrevious(previousMonth)}
          disabled={!previousMonth}
          onClick={handlePrev}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "h-7 w-7 shrink-0 rounded-md border border-input bg-background/60 p-0 text-muted-foreground shadow-xs transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30 cursor-pointer"
          )}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
      ) : !hideNavigation ? (
        <div className="h-7 w-7 shrink-0" />
      ) : null}

      <div className="flex flex-1 items-center justify-center gap-1.5 min-w-0">
        {children}
      </div>

      {!hideNavigation && isLastMonth ? (
        <button
          type="button"
          aria-label={labelNext(nextMonth)}
          disabled={!nextMonth}
          onClick={handleNext}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "h-7 w-7 shrink-0 rounded-md border border-input bg-background/60 p-0 text-muted-foreground shadow-xs transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30 cursor-pointer"
          )}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      ) : !hideNavigation ? (
        <div className="h-7 w-7 shrink-0" />
      ) : null}
    </div>
  )
}

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = idLocale,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={cn("p-3 select-none", className)}
      classNames={{
        root: `${defaultClassNames.root} shadow-none`,
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-2",
        month_caption: "flex justify-center items-center h-8 relative",
        caption_label: "text-xs font-semibold text-foreground select-none",
        dropdowns: "flex items-center justify-center gap-1.5",
        month_grid: "w-full border-collapse",
        weekdays: "flex w-full justify-between mb-1",
        weekday:
          "text-muted-foreground rounded-md w-8 font-medium text-[0.75rem] text-center",
        week: "flex w-full justify-between mt-1",
        day: cn(
          "relative h-8 w-8 p-0 text-center text-xs focus-within:relative focus-within:z-20",
          defaultClassNames.day
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 rounded-lg p-0 font-normal text-xs transition-colors aria-selected:opacity-100 cursor-pointer hover:bg-accent hover:text-accent-foreground"
        ),
        range_end: "day-range-end",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-lg font-semibold shadow-xs",
        today: "bg-muted font-bold text-foreground rounded-lg border border-primary/40",
        outside:
          "day-outside text-muted-foreground/40 opacity-40 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground/30 opacity-30 pointer-events-none",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Nav: () => <></>,
        MonthCaption: CalendarMonthCaption,
        Chevron: ({ orientation }) => {
          const Icon =
            orientation === "left"
              ? ChevronLeftIcon
              : orientation === "right"
                ? ChevronRightIcon
                : ChevronDownIcon
          return <Icon className="h-4 w-4" />
        },
        Dropdown: CalendarDropdown,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
