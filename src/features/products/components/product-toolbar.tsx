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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
      {/* Search & Status Filter */}
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1 max-w-sm sm:max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari kode atau nama produk..."
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

        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/80 text-xs shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onStatusChange("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-card text-foreground shadow-2xs font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => onStatusChange("active")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === "active"
                ? "bg-card text-foreground shadow-2xs font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Aktif
          </button>
          <button
            type="button"
            onClick={() => onStatusChange("inactive")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === "inactive"
                ? "bg-card text-foreground shadow-2xs font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Non-Aktif
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="h-9 px-3 rounded-xl gap-1.5 cursor-pointer text-xs font-medium border-border/80 bg-card shadow-2xs"
          title="Muat ulang data produk"
        >
          <RotateCw
            size={13}
            className={isFetching ? "animate-spin text-primary" : "text-muted-foreground"}
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>

        <Button
          type="button"
          onClick={onCreateClick}
          className="h-9 px-3.5 rounded-xl gap-1.5 cursor-pointer font-semibold text-xs shadow-xs bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={14} />
          <span>Tambah Produk</span>
        </Button>
      </div>
    </div>
  )
}

