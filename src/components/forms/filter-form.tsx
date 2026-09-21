"use client"

import React, { type ReactNode, useState } from "react"
import type {
  UseFormReturn,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form"
import { FormProvider } from "react-hook-form"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Filter,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Search,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterFormProps<T extends FieldValues> {
  methods: UseFormReturn<T>
  onSubmit: (data: T) => void
  onReset: () => void
  children: ReactNode
  className?: string
  submitLabel?: string
  submitIcon?: React.ReactNode
  titleLabel?: string
  titleIcon?: React.ReactNode
  cols?: number
  defaultExpanded?: boolean
  actionsId?: string
  headerId?: string
}

function formatFilterKey(key: string): string {
  const map: Record<string, string> = {
    user_uid: "Pengguna",
    status: "Status",
    from: "Awal",
    to: "Akhir",
    search: "Cari",
    q: "Cari",
    nama: "Nama",
    category_uid: "Kategori",
    brand_uid: "Merek",
    type: "Tipe",
    role: "Peran",
  }
  return map[key] || key.replace(/_/g, " ")
}

function formatFilterValue(val: string): string {
  const lower = val.toLowerCase()
  const map: Record<string, string> = {
    open: "Terbuka",
    closed: "Ditutup",
    active: "Aktif",
    inactive: "Non-Aktif",
    archived: "Diarsipkan",
    true: "Ya",
    false: "Tidak",
  }
  const mapped = map[lower] || val
  return mapped.length > 16 ? `${mapped.slice(0, 14)}...` : mapped
}

export function FilterForm<T extends FieldValues>({
  methods,
  onSubmit,
  onReset,
  children,
  className,
  submitLabel,
  submitIcon,
  titleLabel,
  titleIcon,
  cols,
  defaultExpanded = true,
  actionsId,
  headerId,
}: FilterFormProps<T>) {
  const queryClient = useQueryClient()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const watchedValues = methods.watch()

  // Extract active filter entries
  const activeFilters = React.useMemo(() => {
    if (!watchedValues) {
      return []
    }
    const active: { key: string; value: string }[] = []
    Object.entries(watchedValues).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && val !== "all") {
        active.push({ key, value: String(val) })
      }
    })
    return active
  }, [watchedValues])

  const handleClearSingle = (key: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const resetVal = key === "status" ? "all" : ""
    methods.setValue(key as Path<T>, resetVal as PathValue<T, Path<T>>)
    methods.handleSubmit((data) => {
      onSubmit(data)
      queryClient.invalidateQueries({ type: "active" })
    })()
  }

  // Count the direct children to determine the grid columns dynamically
  const childCount = React.Children.count(children)
  const isSingleFilter = childCount === 1

  // Default icon and label settings depending on child count
  const defaultTitleIcon = isSingleFilter ? (
    <Search size={16} className="text-muted-foreground" />
  ) : (
    <Filter size={16} className="text-muted-foreground" />
  )
  const defaultSubmitIcon = isSingleFilter ? (
    <Search size={14} />
  ) : (
    <Filter size={14} />
  )

  const resolvedTitleIcon =
    titleIcon !== undefined ? titleIcon : defaultTitleIcon
  const resolvedSubmitIcon =
    submitIcon !== undefined ? submitIcon : defaultSubmitIcon

  const resolvedTitleLabel =
    titleLabel || (isSingleFilter ? "Pencarian" : "Filter Pencarian")
  const resolvedSubmitLabel =
    submitLabel || (isSingleFilter ? "Cari" : "Terapkan Filter")

  // Dynamic grid columns for multi-filter layouts
  const resolvedCols =
    cols !== undefined ? cols : Math.min(Math.max(childCount, 1), 4)
  const gridColsClass =
    {
      1: "md:grid-cols-1",
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
    }[resolvedCols as 1 | 2 | 3 | 4] || "md:grid-cols-4"

  // Optimized layout for single-filter (search-only) forms: render inline in a single row
  if (isSingleFilter) {
    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((data) => {
            onSubmit(data)
            queryClient.invalidateQueries({ type: "active" })
          })}
          className={cn(
            "my-2.5 flex flex-col items-end gap-2.5 rounded-xl border border-border bg-card p-2.5 select-none sm:my-3 sm:flex-row sm:gap-3 sm:p-3",
            className
          )}
        >
          <div className="w-full flex-1">{children}</div>
          <div className="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto">
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onReset()
              }}
              variant="outline"
              className="h-8 flex-1 gap-1.5 rounded-xl border-border bg-background px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-10 sm:flex-initial sm:px-4"
            >
              <RotateCcw size={13} />
              Reset
            </Button>
            <Button
              type="submit"
              className="h-8 flex-1 gap-1.5 rounded-xl border-none bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 sm:h-10 sm:flex-initial sm:px-4"
            >
              {resolvedSubmitIcon}
              {resolvedSubmitLabel}
            </Button>
          </div>
        </form>
      </FormProvider>
    )
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((data) => {
          onSubmit(data)
          queryClient.invalidateQueries({ type: "active" })
        })}
        className={cn(
          "my-2.5 rounded-xl border border-border bg-card transition-all duration-200 select-none sm:my-3",
          isExpanded ? "space-y-3 p-3 sm:space-y-4 sm:p-4" : "p-2.5 sm:p-3",
          className
        )}
      >
        {/* Toggle Header */}
        <div
          id={headerId}
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex cursor-pointer items-center justify-between select-none"
        >
          <div className="flex min-w-0 items-center gap-2 text-foreground">
            {resolvedTitleIcon}
            <span className="truncate text-xs font-bold">
              {resolvedTitleLabel}
            </span>
            {activeFilters.length > 0 && (
              <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                {activeFilters.length} Aktif
              </span>
            )}
          </div>
          <div className="ml-2 flex shrink-0 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground">
            <span className="xs:inline hidden text-[10px] font-bold tracking-wider uppercase">
              {isExpanded ? "Sembunyikan" : "Tampilkan"}
            </span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {/* Active Filter Chips Summary (Visible when collapsed and filters are applied) */}
        {!isExpanded && activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-border pt-2">
            <span className="shrink-0 text-[10px] font-bold text-muted-foreground">
              Filter Aktif:
            </span>
            {activeFilters.map((filter) => (
              <span
                key={filter.key}
                className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary shadow-2xs"
              >
                <span className="capitalize">
                  {formatFilterKey(filter.key)}
                </span>
                :{" "}
                <span className="font-extrabold">
                  {formatFilterValue(filter.value)}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleClearSingle(filter.key, e)}
                  className="ml-0.5 cursor-pointer rounded border-none bg-transparent p-0.5 text-primary transition-colors hover:bg-primary/20"
                  title={`Hapus filter ${formatFilterKey(filter.key)}`}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}

        {isExpanded && (
          <>
            {/* Filter Fields Grid */}
            <div
              className={cn(
                "xs:grid-cols-2 grid grid-cols-1 items-end gap-2.5 border-t border-border pt-2.5 sm:gap-4 sm:pt-3",
                gridColsClass
              )}
            >
              {children}
            </div>

            {/* Filter Action Buttons (Bottom Right) */}
            <div
              id={actionsId}
              className="flex items-center justify-end gap-2 border-t border-border pt-2.5 sm:pt-3"
            >
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onReset()
                }}
                variant="outline"
                className="h-8 flex-1 gap-1.5 rounded-xl border-border bg-background px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-9 sm:flex-initial sm:px-4"
              >
                <RotateCcw size={13} />
                Reset
              </Button>
              <Button
                type="submit"
                className="h-8 flex-1 gap-1.5 rounded-xl border-none bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 sm:h-9 sm:flex-initial sm:px-4"
              >
                {resolvedSubmitIcon}
                {resolvedSubmitLabel}
              </Button>
            </div>
          </>
        )}
      </form>
    </FormProvider>
  )
}
