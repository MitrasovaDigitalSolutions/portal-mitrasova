"use client"

import type React from "react"
import { Search, X, RotateCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DateRangeFilter } from "@/components/shared"
import type { InvoiceStatus } from "../@types/invoice"
import { cn } from "@/lib/utils"

const STATUS_TABS: { label: string; value: "all" | InvoiceStatus }[] = [
  { label: "Semua", value: "all" },
  { label: "Belum Dibayar", value: "unpaid" },
  { label: "Lunas", value: "paid" },
  { label: "Kedaluwarsa", value: "expired" },
  { label: "Dibatalkan", value: "cancelled" },
]

interface InvoicesToolbarProps {
  searchInput: string
  onSearchChange: (val: string) => void
  statusFilter: "all" | InvoiceStatus
  onStatusChange: (status: "all" | InvoiceStatus) => void
  createdFrom?: string
  onCreatedFromChange?: (val: string) => void
  createdTo?: string
  onCreatedToChange?: (val: string) => void
  onResetFilters?: () => void
  isFetching: boolean
  onRefresh: () => void
}

export function InvoicesToolbar({
  searchInput,
  onSearchChange,
  statusFilter,
  onStatusChange,
  createdFrom,
  onCreatedFromChange,
  createdTo,
  onCreatedToChange,
  onResetFilters,
  isFetching,
  onRefresh,
}: InvoicesToolbarProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-stretch justify-between gap-2.5 sm:flex-row sm:items-center">
      {/* Left: Search Input & Status Filter Pills */}
      <div className="flex flex-1 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative max-w-sm flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nomor invoice, pelanggan, email..."
            className="h-9 rounded-xl border-border/80 bg-card pr-8.5 pl-8.5 text-xs shadow-2xs focus-visible:ring-1"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Bersihkan pencarian"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Status Filter Segmented Buttons */}
        <div className="flex max-w-full shrink-0 items-center gap-1 self-start overflow-x-auto rounded-xl border border-border/80 bg-muted/50 p-1 sm:self-auto">
          {STATUS_TABS.map((tab) => {
            const isSelected = statusFilter === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onStatusChange(tab.value)}
                className={cn(
                  "cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all",
                  isSelected
                    ? "bg-card font-bold text-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Date Range Filter (Created At) */}
        {onCreatedFromChange && onCreatedToChange && (
          <DateRangeFilter
            dateFrom={createdFrom}
            dateTo={createdTo}
            onDateFromChange={onCreatedFromChange}
            onDateToChange={onCreatedToChange}
            fromPlaceholder="Dari tgl..."
            toPlaceholder="Sampai tgl..."
            size="sm"
          />
        )}

        {/* Reset Filter Button */}
        {onResetFilters &&
          Boolean(
            searchInput ||
              statusFilter !== "all" ||
              createdFrom ||
              createdTo
          ) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-8 cursor-pointer gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X size={12} />
              <span>Reset</span>
            </Button>
          )}
      </div>

      {/* Right: Actions */}
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="h-9 cursor-pointer gap-1.5 rounded-xl border-border/80 bg-card px-3 text-xs font-medium shadow-2xs"
          title="Muat ulang data invoice"
        >
          <RotateCw
            size={13}
            className={
              isFetching ? "animate-spin text-primary" : "text-muted-foreground"
            }
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>
    </div>
  )
}
