"use client"

import type React from "react"
import { RotateCw, Plus, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ProductStatusFilter } from "../hooks"

interface ProductToolbarProps {
  searchInput: string
  onSearchChange: (value: string) => void
  statusFilter: ProductStatusFilter
  onStatusChange: (status: ProductStatusFilter) => void
  isFetching: boolean
  onRefresh: () => void
  onCreateClick: () => void
}

export function ProductToolbar({
  searchInput,
  onSearchChange,
  statusFilter,
  onStatusChange,
  isFetching,
  onRefresh,
  onCreateClick,
}: ProductToolbarProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-stretch justify-between gap-2.5 sm:flex-row sm:items-center">
      {/* Search & Status Filter */}
      <div className="flex flex-1 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1 sm:max-w-md">
          <Search
            size={14}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari kode atau nama produk..."
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

        <div className="flex shrink-0 items-center gap-1 self-start rounded-xl border border-border/80 bg-muted/50 p-1 text-xs sm:self-auto">
          <button
            type="button"
            onClick={() => onStatusChange("all")}
            className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === "all"
                ? "bg-card font-bold text-foreground shadow-2xs"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => onStatusChange("active")}
            className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === "active"
                ? "bg-card font-bold text-foreground shadow-2xs"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            }`}
          >
            Aktif
          </button>
          <button
            type="button"
            onClick={() => onStatusChange("inactive")}
            className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === "inactive"
                ? "bg-card font-bold text-foreground shadow-2xs"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            }`}
          >
            Non-Aktif
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="h-9 cursor-pointer gap-1.5 rounded-xl border-border/80 bg-card px-3 text-xs font-medium shadow-2xs"
          title="Muat ulang data produk"
        >
          <RotateCw
            size={13}
            className={
              isFetching ? "animate-spin text-primary" : "text-muted-foreground"
            }
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>

        <Button
          type="button"
          onClick={onCreateClick}
          className="h-9 cursor-pointer gap-1.5 rounded-xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
        >
          <Plus size={14} />
          <span>Tambah Produk</span>
        </Button>
      </div>
    </div>
  )
}
