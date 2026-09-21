"use client"

import type { JSX } from "react"
import { CheckCircle2, Loader2, Puzzle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/utils"
import type { ProductAddon } from "@/features/products/@types/product"
import type { SubscribedAddonItem } from "../hooks/use-license-order"

interface LicenseOrderAddonsListProps {
  addons: ProductAddon[]
  isLoading: boolean
  selectedAddonIds: string[]
  isAnnual: boolean
  subscribedAddons?: SubscribedAddonItem[]
  onToggleAddon: (addonId: string) => void
}

export function LicenseOrderAddonsList({
  addons,
  isLoading,
  selectedAddonIds,
  isAnnual,
  subscribedAddons,
  onToggleAddon,
}: LicenseOrderAddonsListProps): JSX.Element {
  return (
    <div className="space-y-2.5 pt-1">
      {/* 1. Show already subscribed/active addons info if any */}
      {subscribedAddons && subscribedAddons.length > 0 && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={13} className="shrink-0" />
            <span>Modul Add-on yang Sudah Aktif pada Lisensi ini:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {subscribedAddons.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 rounded-md bg-card/80 px-2 py-0.5 text-[10px] font-medium text-foreground border border-emerald-500/30 shadow-2xs"
              >
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>{item.name}</span>
                {item.code && (
                  <span className="font-mono text-[9px] text-muted-foreground">
                    ({item.code})
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 2. Header for unowned/additional addons */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Puzzle size={13} className="text-primary" />
          <span>Pilih Modul Add-on Tambahan</span>
        </label>
        {selectedAddonIds.length > 0 && (
          <span className="text-[11px] font-medium text-primary">
            {selectedAddonIds.length} modul dipilih
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <Loader2 size={16} className="animate-spin mr-2" />
          <span className="text-xs">Memuat katalog modul add-on...</span>
        </div>
      ) : addons.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground space-y-1">
          {subscribedAddons && subscribedAddons.length > 0 ? (
            <>
              <p className="font-medium text-foreground">
                Seluruh Modul Add-on Sudah Aktif
              </p>
              <p className="text-[11px] text-muted-foreground">
                Semua modul add-on yang tersedia untuk produk ini sudah aktif pada lisensi Anda.
              </p>
            </>
          ) : (
            <p>Tidak ada modul add-on yang tersedia untuk produk ini.</p>
          )}
        </div>
      ) : (
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {addons.map((addon) => {
            const isChecked = selectedAddonIds.includes(addon.id)
            const price = isAnnual
              ? addon.harga_tahunan
              : addon.harga_bulanan

            return (
              <div
                key={addon.id}
                onClick={() => onToggleAddon(addon.id)}
                className={cn(
                  "flex items-center justify-between rounded-xl border p-3 transition-all cursor-pointer",
                  isChecked
                    ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
                    : "border-border bg-card hover:bg-muted/30"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => onToggleAddon(addon.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-foreground">
                        {addon.nama}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        ({addon.code})
                      </span>
                    </div>
                    {addon.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {addon.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-xs text-foreground font-mono">
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
