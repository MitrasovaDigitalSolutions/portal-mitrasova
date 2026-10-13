"use client"

import type { JSX } from "react"
import { Plus, RotateCw, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type ExpenseCategoryStatusFilter = "all" | "active" | "inactive"

export interface ExpenseCategoriesToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: ExpenseCategoryStatusFilter
  onStatusFilterChange: (filter: ExpenseCategoryStatusFilter) => void
  isFetching?: boolean
  onRefresh?: () => void
  onAddCategory: () => void
}

export function ExpenseCategoriesToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  isFetching,
  onRefresh,
  onAddCategory,
}: ExpenseCategoriesToolbarProps): JSX.Element {
  const tabs: { value: ExpenseCategoryStatusFilter; label: string }[] = [
    { value: "all", label: "Semua" },
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Non-Aktif" },
  ]

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left Search & Tabs */}
      <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search
            size={13}
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama atau kode kategori..."
            className="h-8.5 rounded-xl bg-background pr-7 pl-8 text-xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
              title="Hapus pencarian"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/50 p-1 text-xs">
          {tabs.map((tab) => {
            const isSelected = statusFilter === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onStatusFilterChange(tab.value)}
                className={cn(
                  "cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
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
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-8.5 cursor-pointer rounded-xl border-border px-2.5 text-xs shadow-2xs"
            title="Muat ulang kategori"
          >
            <RotateCw
              size={13}
              className={
                isFetching
                  ? "animate-spin text-primary"
                  : "text-muted-foreground"
              }
            />
          </Button>
        )}

        <Button
          type="button"
          onClick={onAddCategory}
          className="h-8.5 cursor-pointer gap-1.5 rounded-xl px-3 text-xs font-semibold shadow-xs"
        >
          <Plus size={13} />
          <span>Tambah Kategori</span>
        </Button>
      </div>
    </div>
  )
}
