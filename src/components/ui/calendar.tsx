"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DropdownProps,
} from "react-day-picker"

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
      <SelectTrigger className="relative z-10 flex h-7 cursor-pointer items-center gap-1 rounded-md border border-input bg-transparent px-2 py-1 text-xs font-semibold transition-colors select-none hover:bg-accent hover:text-accent-foreground">
        <SelectValue>{selectedOption?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent className="z-[100] max-h-[300px] overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md">
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

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: `${defaultClassNames.root} shadow-none`,
        months: `${defaultClassNames.months} flex flex-col sm:flex-row gap-4 relative`,
        month: `${defaultClassNames.month} space-y-4`,
        month_caption: `${defaultClassNames.month_caption} flex justify-center pt-1 relative items-center text-sm font-medium`,
        caption_label: `${defaultClassNames.caption_label} hidden`,
        dropdowns: `${defaultClassNames.dropdowns} flex gap-2 justify-center items-center`,
        nav: `${defaultClassNames.nav} flex items-center gap-1`,
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "absolute top-0 left-1 z-10 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "absolute top-0 right-1 z-10 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        month_grid: `${defaultClassNames.month_grid} w-full border-collapse space-y-1`,
        weekdays: `${defaultClassNames.weekdays} flex`,
        weekday: `${defaultClassNames.weekday} text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-center`,
        week: `${defaultClassNames.week} flex w-full mt-2`,
        day: cn(
          "relative h-8 w-8 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          defaultClassNames.day
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 rounded-md p-0 font-normal transition-colors aria-selected:opacity-100"
        ),
        range_end: "day-range-end",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
        today: "bg-accent text-accent-foreground rounded-md font-bold",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
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
