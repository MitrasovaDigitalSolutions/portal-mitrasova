"use client"

import type React from "react"
import { Pencil, Trash2, CheckCircle2, XCircle, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils"
import type { ProductAddon } from "../@types/product"

export interface AddonMobileCardProps {
  addon: ProductAddon
  onEdit: (addon: ProductAddon) => void
  onDelete: (addon: ProductAddon) => void
}

export function AddonMobileCard({
  addon,
  onEdit,
  onDelete,
}: AddonMobileCardProps): React.JSX.Element {
  return (
    <div className="rounded-xl border border-border bg-card p-3 space-y-2.5 shadow-2xs hover:border-sky-500/30 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shadow-2xs">
            <Layers size={13} />
          </div>
          <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 truncate">
            {addon.code}
          </span>
        </div>

        {addon.is_active ? (
          <Badge variant="success" className="gap-1 text-[10px] shrink-0 font-medium">
            <CheckCircle2 className="size-2.5" />
            Aktif
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1 text-[10px] text-muted-foreground shrink-0 font-medium">
            <XCircle className="size-2.5" />
            Non-Aktif
          </Badge>
        )}
      </div>

      {/* Name and Description */}
      <div className="space-y-0.5">
        <div className="font-semibold text-xs text-foreground truncate">{addon.nama}</div>
        {addon.description ? (
          <p className="text-[11px] text-muted-foreground line-clamp-1 leading-tight">
            {addon.description}
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground/60 italic">
            Tanpa deskripsi tambahan
          </p>
        )}
      </div>

      {/* Pricing Row */}
      <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/60 pt-2 font-mono">
        <div>
          <span className="text-[10px] text-muted-foreground block font-sans">
            Bulanan:
          </span>
          <span className="font-semibold text-foreground">
            {formatCurrency(addon.harga_bulanan)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block font-sans">
            Tahunan:
          </span>
          <span className="font-semibold text-foreground">
            {formatCurrency(addon.harga_tahunan)}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-1 pt-1.5 border-t border-border/60">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(addon)}
          className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
          title="Edit Modul Addon"
        >
          <Pencil size={12} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(addon)}
          className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-destructive cursor-pointer"
          title="Hapus Modul Addon"
        >
          <Trash2 size={12} />
        </Button>
      </div>
    </div>
  )
}
