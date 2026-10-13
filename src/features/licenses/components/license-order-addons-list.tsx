"use client"

import type { JSX } from "react"
import { Loader2, Puzzle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/utils"
import type { ProductAddon } from "@/features/products/@types/product"

interface LicenseOrderAddonsListProps {
  addons: ProductAddon[]
  isLoading: boolean
  selectedAddonIds: string[]
  isAnnual: boolean
  currentSubscribedAddonIds: Set<string>
  onToggleAddon: (addonId: string) => void
}

export function LicenseOrderAddonsList({
  addons,
  isLoading,
  selectedAddonIds,
  isAnnual,
  currentSubscribedAddonIds,
  onToggleAddon,
}: LicenseOrderAddonsListProps): JSX.Element {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Puzzle size={13} className="text-primary" />
          <span>Pilihan Modul Add-on</span>
        </label>
        {addons.length > 0 && (
          <Badge
            variant="secondary"
            className="px-2 py-0.5 font-mono text-[10px] font-medium"
          >
            {selectedAddonIds.length} dari {addons.length} dipilih
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 size={16} className="mr-2 animate-spin" />
          <span className="text-xs">Memuat katalog modul add-on...</span>
        </div>
      ) : addons.length === 0 ? (
        <div className="space-y-1 rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Tidak Ada Modul Add-on</p>
          <p className="text-[11px] text-muted-foreground">
            Produk software ini belum memiliki modul add-on terdaftar di sistem.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {addons.map((addon) => {
            const isChecked = selectedAddonIds.includes(addon.id)
            const isAlreadySubscribed = currentSubscribedAddonIds.has(addon.id)
            const price = isAnnual ? addon.harga_tahunan : addon.harga_bulanan

            return (
              <div
                key={addon.id}
                onClick={() => onToggleAddon(addon.id)}
                className={cn(
                  "flex cursor-pointer items-start justify-between rounded-xl border p-3 transition-all",
                  isChecked
                    ? "border-primary/50 bg-primary/5 shadow-2xs ring-1 ring-primary/25"
                    : "border-border bg-card/60 opacity-75 hover:bg-muted/30 hover:opacity-100"
                )}
              >
                <div className="flex min-w-0 flex-1 items-start gap-2.5 pr-2">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => onToggleAddon(addon.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="truncate text-xs font-semibold text-foreground">
                        {addon.nama}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        ({addon.code})
                      </span>
                      {isAlreadySubscribed && (
                        <span className="py-0.2 inline-flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <span className="size-1 rounded-full bg-emerald-500" />
                          Aktif di Lisensi
                        </span>
                      )}
                    </div>
                    {addon.description && (
                      <p className="line-clamp-2 text-[11px] leading-tight text-muted-foreground">
                        {addon.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="font-mono text-xs font-bold text-foreground">
                    {formatCurrency(price || 0)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    /{isAnnual ? "tahun" : "bulan"}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
