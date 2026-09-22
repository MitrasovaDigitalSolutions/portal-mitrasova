"use client"

import type React from "react"
import { RotateCw, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductToolbarProps {
  isFetching: boolean
  onRefresh: () => void
  onCreateClick: () => void
}

export function ProductToolbar({
  isFetching,
  onRefresh,
  onCreateClick,
}: ProductToolbarProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-end gap-2">
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
  )
}
