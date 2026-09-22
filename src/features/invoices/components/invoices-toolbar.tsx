"use client"

import type React from "react"
import { Search, X, RotateCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  isFetching: boolean
  onRefresh: () => void
}

export function InvoicesToolbar({
  searchInput,
  onSearchChange,
  statusFilter,
  onStatusChange,
  isFetching,
  onRefresh,
}: InvoicesToolbarProps): React.JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
      {/* Left: Search Input & Status Filter Pills */}
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nomor invoice, pelanggan, email..."
            className="pl-8.5 pr-8.5 h-9 text-xs rounded-xl bg-card border-border/80 shadow-2xs focus-visible:ring-1"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-0.5"
              aria-label="Bersihkan pencarian"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Status Filter Segmented Buttons */}
        <div className="flex items-center gap-1 rounded-xl bg-muted/50 p-1 border border-border/80 shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
          {STATUS_TABS.map((tab) => {
            const isSelected = statusFilter === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onStatusChange(tab.value)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                  isSelected
                    ? "bg-card text-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="h-9 px-3 rounded-xl gap-1.5 cursor-pointer text-xs font-medium border-border/80 bg-card shadow-2xs"
          title="Muat ulang data invoice"
        >
          <RotateCw
            size={13}
            className={isFetching ? "animate-spin text-primary" : "text-muted-foreground"}
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>
    </div>
  )
}
