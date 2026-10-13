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
    <div className="flex flex-col items-stretch justify-between gap-2.5 sm:flex-row sm:items-center">
      {/* Search Input */}
      <div className="relative max-w-sm flex-1 sm:max-w-md">
        <Search
          size={14}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama pemilik, email, atau perusahaan..."
          className="h-9 rounded-xl border-border/80 bg-card pr-8.5 pl-8.5 text-xs shadow-2xs focus-visible:ring-1"
        />
        {search && (
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

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-9 cursor-pointer gap-1.5 rounded-xl border-border/80 bg-card px-3 text-xs font-medium shadow-2xs"
            title="Muat ulang data klien"
          >
            <RefreshCw
              size={13}
              className={
                isFetching
                  ? "animate-spin text-primary"
                  : "text-muted-foreground"
              }
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        )}

        <Button
          type="button"
          onClick={onCreateClient}
          className="h-9 cursor-pointer gap-1.5 rounded-xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
        >
          <Plus size={14} />
          <span>Tambah Klien</span>
        </Button>
      </div>
    </div>
  )
}
