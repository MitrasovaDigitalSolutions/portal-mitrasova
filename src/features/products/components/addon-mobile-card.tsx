"use client"

import type React from "react"
import { Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react"
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
    <div className="rounded-xl border border-border bg-card p-3 space-y-2.5 shadow-2xs hover:border-sky-500/40 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20">
          {addon.code}
        </span>
        {addon.is_active ? (
          <Badge variant="success" className="gap-1 text-[10px]">
            <CheckCircle2 className="size-2.5" />
            Aktif
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1 text-[10px] text-muted-foreground">
            <XCircle className="size-2.5" />
            Non-Aktif
          </Badge>
        )}
      </div>

      <div className="space-y-0.5">
        <div className="font-semibold text-xs text-foreground">{addon.nama}</div>
        {addon.description && (
          <div className="text-[11px] text-muted-foreground line-clamp-2">
            {addon.description}
          </div>
        )}
      </div>

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

      <div className="flex items-center justify-end gap-1.5 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-[11px] px-2 cursor-pointer"
          onClick={() => onEdit(addon)}
        >
          <Pencil className="size-3 mr-1" />
          Edit
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="h-7 text-[11px] px-2 cursor-pointer"
          onClick={() => onDelete(addon)}
        >
          <Trash2 className="size-3 mr-1" />
          Hapus
        </Button>
      </div>
    </div>
  )
}
