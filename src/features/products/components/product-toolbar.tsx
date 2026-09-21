"use client"

import type React from "react"
import { Search, X, RotateCw, Plus, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const STATUS_TABS: { label: string; value: "all" | "active" | "inactive" }[] = [
  { label: "Semua", value: "all" },
  { label: "Aktif", value: "active" },
  { label: "Non-Aktif", value: "inactive" },
]

interface ProductToolbarProps {
  searchInput: string
  onSearchChange: (val: string) => void
  statusFilter: "all" | "active" | "inactive"
  onStatusChange: (status: "all" | "active" | "inactive") => void
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
    <div className="space-y-4">
      {/* Top Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Package className="size-5 text-primary" />
            Katalog Produk & Layanan
          </h1>
          <p className="text-xs text-muted-foreground">
            Kelola master produk ekosistem Mitrasova dan modul product addons
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-9 px-3 gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <RotateCw className={cn("size-3.5", isFetching && "animate-spin")} />
            <span>Segarkan</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onCreateClick}
            className="h-9 px-3.5 gap-1.5 text-xs font-semibold cursor-pointer shadow-xs"
          >
            <Plus className="size-4" />
            <span>Tambah Produk</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari kode atau nama produk..."
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-8 h-9 text-xs"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Status Segmented Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {STATUS_TABS.map((tab) => {
              const isSelected = statusFilter === tab.value
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => onStatusChange(tab.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border"
                  )}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
