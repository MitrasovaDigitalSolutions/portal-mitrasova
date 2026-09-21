"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, Loader2, Plus } from "lucide-react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"
import { Scrollable } from "@/components/ui/scrollable"

export interface CommandOption {
  value: string
  label: string
  disabled?: boolean
  description?: string
  badge?: string
}

export interface CommandSelectProps {
  options: CommandOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  isLoading?: boolean
  onSearchChange?: (search: string) => void
  disableLocalFilter?: boolean
  onScrollBottom?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
  className?: string
  wrapperClassName?: string
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  maxLabelLength?: number
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
  onCreateOption?: (searchQuery: string) => void
  createOptionLabel?: string
}

// ─── Command Context ─────────────────────────────────────────────────────────
const CommandContext = React.createContext<{
  search: string
  setSearch: (s: string) => void
  selectedValue?: string
  onSelect?: (val: string) => void
  disableLocalFilter?: boolean
}>({
  search: "",
  setSearch: () => {},
})

// ─── Command (Wrapper) ───────────────────────────────────────────────────────
export const Command = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> & {
    selectedValue?: string
    onSelect?: (val: string) => void
    disableLocalFilter?: boolean
    search?: string
    onSearchChange?: (s: string) => void
  }
>(
  (
    {
      className,
      children,
      selectedValue,
      onSelect,
      disableLocalFilter,
      search: controlledSearch,
      onSearchChange: setControlledSearch,
      ...props
    },
    ref
  ) => {
    const [internalSearch, setInternalSearch] = React.useState("")
    const search =
      controlledSearch !== undefined ? controlledSearch : internalSearch
    const setSearch = setControlledSearch || setInternalSearch

    return (
      <CommandContext.Provider
        value={{
          search,
          setSearch,
          selectedValue,
          onSelect,
          disableLocalFilter,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-md",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </CommandContext.Provider>
    )
  }
)
Command.displayName = "Command"

// ─── CommandInput ────────────────────────────────────────────────────────────
export const CommandInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    onValueChange?: (val: string) => void
  }
>(({ className, onValueChange, ...props }, ref) => {
  const { search, setSearch } = React.useContext(CommandContext)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)
    onValueChange?.(val)
  }

  return (
    <div
      className="flex items-center border-b border-border bg-muted/20 px-3 py-1"
      cmdk-input-wrapper=""
    >
      <Search className="mr-2 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-50" />
      <input
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md bg-transparent py-3 text-xs outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        value={search}
        onChange={handleChange}
        {...props}
      />
    </div>
  )
})
CommandInput.displayName = "CommandInput"

// ─── CommandList ─────────────────────────────────────────────────────────────
export const CommandList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    onScrollBottom?: () => void
    hasMore?: boolean
    isLoadingMore?: boolean
    isLoading?: boolean
  }
>(
  (
    {
      className,
      onScrollBottom,
      hasMore,
      isLoadingMore,
      isLoading,
      onScroll,
      children,
      ...props
    },
    ref
  ) => {
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      onScroll?.(e)
      const target = e.currentTarget
      if (target.scrollHeight - target.scrollTop - target.clientHeight < 35) {
        if (hasMore && !isLoadingMore && !isLoading && onScrollBottom) {
          onScrollBottom()
        }
      }
    }

    return (
      <Scrollable
        ref={ref}
        onScroll={handleScroll}
        className={cn("max-h-[220px] p-1", className)}
        {...props}
      >
        {children}
        {isLoadingMore && (
          <div className="flex items-center justify-center gap-1.5 py-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            <span>Memuat lebih banyak...</span>
          </div>
        )}
      </Scrollable>
    )
  }
)
CommandList.displayName = "CommandList"

// ─── CommandEmpty ────────────────────────────────────────────────────────────
export const CommandEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isLoading?: boolean
  }
>(({ className, isLoading, children, ...props }, ref) => {
  if (isLoading) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-1.5 py-4 text-center text-xs text-muted-foreground",
          className
        )}
        {...props}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        <span>Memuat data...</span>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        "py-4 text-center text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      {children || "Tidak ada hasil ditemukan."}
    </div>
  )
})
CommandEmpty.displayName = "CommandEmpty"

// ─── CommandItem ─────────────────────────────────────────────────────────────
export const CommandItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
    keywords?: string[]
    disabled?: boolean
  }
>(
  (
    { className, value, keywords = [], disabled, children, onClick, ...props },
    ref
  ) => {
    const { search, selectedValue, onSelect, disableLocalFilter } =
      React.useContext(CommandContext)

    const matches = React.useMemo(() => {
      if (disableLocalFilter) {
        return true
      }
      if (!search) {
        return true
      }
      const searchLower = search.toLowerCase().trim()
      if (!searchLower) {
        return true
      }

      const valueLower = (value || "").toLowerCase()
      const labelText =
        typeof children === "string" ? children.toLowerCase() : ""

      return (
        labelText.includes(searchLower) ||
        valueLower.includes(searchLower) ||
        keywords.some((k) => (k || "").toLowerCase().includes(searchLower))
      )
    }, [search, value, children, keywords, disableLocalFilter])

    if (!matches) {
      return null
    }

    const isSelected = selectedValue === value

    const handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        return
      }
      onSelect?.(value)
      onClick?.(e)
    }

    return (
      <div
        ref={ref}
        data-disabled={disabled}
        className={cn(
          "relative flex cursor-pointer items-center rounded-lg px-2.5 py-1.5 text-xs transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
          isSelected && "bg-primary/10 font-bold text-primary",
          className
        )}
        onClick={handleSelect}
        {...props}
      >
        {isSelected && (
          <Check className="mr-2 h-3.5 w-3.5 shrink-0 text-primary" />
        )}
        <div
          className={cn("min-w-0 flex-1 text-left", !isSelected && "pl-[22px]")}
        >
          {children || value}
        </div>
      </div>
    )
  }
)
CommandItem.displayName = "CommandItem"

export function CommandSelect({
  options,
  value,
  onChange,
  placeholder = "Pilih opsi...",
  searchPlaceholder = "Cari opsi...",
  emptyMessage = "Tidak ada hasil ditemukan.",
  isLoading = false,
  onSearchChange,
  disableLocalFilter,
  onScrollBottom,
  hasMore,
  isLoadingMore,
  leftIcon,
  rightElement,
  className,
  wrapperClassName,
  disabled = false,
  size = "sm",
  maxLabelLength,
  onCreateOption,
  createOptionLabel,
}: CommandSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    if (!open) {
      setSearch("")
    }
  }, [open])

  const selectedOption = options.find((opt) => opt.value === value)

  const sizeClasses = {
    sm: "h-8 text-xs font-normal",
    md: "h-10 text-xs font-normal",
    lg: "h-12 text-sm font-normal",
  }[size]

  const handleSelect = (val: string) => {
    onChange(val)
    setOpen(false)
  }

  const isAsyncMode =
    disableLocalFilter !== undefined ? disableLocalFilter : !!onSearchChange

  const filteredOptions = React.useMemo(() => {
    if (isAsyncMode || !search.trim()) {
      return options
    }
    const q = search.trim().toLowerCase()
    return options.filter((opt) => {
      const labelMatch = opt.label?.toLowerCase().includes(q)
      const valueMatch = opt.value?.toLowerCase().includes(q)
      const descMatch = opt.description?.toLowerCase().includes(q)
      return labelMatch || valueMatch || descMatch
    })
  }, [options, search, isAsyncMode])

  const handleSearchInput = (val: string) => {
    setSearch(val)
    onSearchChange?.(val)
  }

  return (
    <div className={cn("relative w-full max-w-full min-w-0", wrapperClassName)}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger
          render={
            <button
              type="button"
              disabled={disabled}
              title={selectedOption ? selectedOption.label : undefined}
              className={cn(
                "flex w-full max-w-full cursor-pointer items-center justify-between gap-2 overflow-hidden rounded-xl border border-input bg-background px-3 py-1.5 transition-all outline-none hover:bg-accent/50 focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
                sizeClasses,
                className
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                {leftIcon && <span className="shrink-0">{leftIcon}</span>}
                <span className="truncate text-left">
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
                {rightElement}
                <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
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
            <PopoverPrimitive.Popup
              className={cn(
                "max-h-[300px] w-(--anchor-width) min-w-[200px] origin-(--transform-origin) animate-in overflow-hidden duration-100 fade-in-0 outline-none zoom-in-95"
              )}
            >
              <Command
                selectedValue={value}
                onSelect={handleSelect}
                disableLocalFilter={isAsyncMode}
                search={search}
                onSearchChange={handleSearchInput}
                className="shadow-lg"
              >
                <CommandInput
                  placeholder={searchPlaceholder}
                  onValueChange={handleSearchInput}
                  autoFocus
                />
                <CommandList
                  onScrollBottom={onScrollBottom}
                  hasMore={hasMore}
                  isLoadingMore={isLoadingMore}
                  isLoading={isLoading}
                >
                  {isLoading && <CommandEmpty isLoading={true} />}
                  {!isLoading && filteredOptions.length === 0 && (
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                  )}
                  {!isLoading &&
                    filteredOptions.map((opt, idx) => {
                      const truncatedLabel =
                        maxLabelLength && opt.label.length > maxLabelLength
                          ? opt.label.substring(0, maxLabelLength) + "..."
                          : opt.label
                      return (
                        <CommandItem
                          key={`${opt.value}-${idx}`}
                          value={opt.value}
                          disabled={opt.disabled}
                          keywords={[opt.label, opt.description || ""]}
                          title={
                            opt.description
                              ? `${opt.label} (${opt.description})`
                              : opt.label
                          }
                        >
                          <div className="flex w-full min-w-0 items-center justify-between gap-2">
                            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                              <span className="block truncate font-medium">
                                {truncatedLabel}
                              </span>
                              {opt.description && (
                                <span className="block truncate text-[10px] font-normal text-muted-foreground">
                                  {opt.description}
                                </span>
                              )}
                            </div>
                            {opt.badge && (
                              <span className="shrink-0 rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[9px] leading-none font-bold text-primary uppercase">
                                {opt.badge}
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      )
                    })}
                </CommandList>
                {onCreateOption && (
                  <button
                    type="button"
                    onClick={() => {
                      onCreateOption(search.trim())
                      setOpen(false)
                    }}
                    className="flex w-full shrink-0 cursor-pointer items-center gap-2 border-t border-border bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                  >
                    <Plus className="h-3.5 w-3.5 shrink-0 stroke-[2.5] text-primary" />
                    <span className="truncate">
                      {createOptionLabel
                        ? createOptionLabel
                        : search.trim()
                          ? `Tambah "${search.trim()}" Baru`
                          : "Tambah Baru"}
                    </span>
                  </button>
                )}
              </Command>
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  )
}
