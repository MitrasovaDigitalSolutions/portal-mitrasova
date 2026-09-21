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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama pemilik, email, atau perusahaan..."
          className="pl-9 pr-9 h-10 text-xs rounded-xl"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-10 px-3 rounded-xl gap-2 cursor-pointer"
            title="Muat ulang data"
          >
            <RefreshCw
              size={14}
              className={isFetching ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline text-xs">Refresh</span>
          </Button>
        )}

        <Button
          type="button"
          onClick={onCreateClient}
          className="h-10 px-4 rounded-xl gap-2 cursor-pointer font-medium text-xs shadow-xs"
        >
          <Plus size={15} />
          <span>Tambah Klien</span>
        </Button>
      </div>
    </div>
  )
}
