"use client"

import type React from "react"
import { Plus, RefreshCw, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ClientsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  isFetching?: boolean
  onRefresh?: () => void
  onCreateClient: () => void
}

export function ClientsToolbar({
  search,
  onSearchChange,
  isFetching = false,
  onRefresh,
  onCreateClient,
}: ClientsToolbarProps): React.JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm sm:max-w-md">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama pemilik, email, atau perusahaan..."
          className="pl-8.5 pr-8.5 h-9 text-xs rounded-xl bg-card border-border/80 shadow-2xs focus-visible:ring-1"
        />
        {search && (
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

      {/* Actions */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-9 px-3 rounded-xl gap-1.5 cursor-pointer text-xs font-medium border-border/80 bg-card shadow-2xs"
            title="Muat ulang data klien"
          >
            <RefreshCw
              size={13}
              className={isFetching ? "animate-spin text-primary" : "text-muted-foreground"}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        )}

        <Button
          type="button"
          onClick={onCreateClient}
          className="h-9 px-3.5 rounded-xl gap-1.5 cursor-pointer font-semibold text-xs shadow-xs bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={14} />
          <span>Tambah Klien</span>
        </Button>
      </div>
    </div>
  )
}
