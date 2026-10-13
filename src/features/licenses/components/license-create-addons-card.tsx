"use client"

import type { JSX } from "react"
import { Check, Layers, ShieldCheck, Sparkles, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { ProductAddon } from "@/features/products/@types/product"
import { formatCurrency } from "@/utils"

interface LicenseCreateAddonsCardProps {
  hasSelectedProduct: boolean
  isLoadingProductDetail: boolean
  builtInAddons: ProductAddon[]
  purchasableAddons: ProductAddon[]
  selectedAddonIds: string[]
  isAnnual: boolean
  onToggleAddon: (id: string) => void
  onSelectAllAddons?: () => void
  onClearAddons?: () => void
}

export function LicenseCreateAddonsCard({
  hasSelectedProduct,
  isLoadingProductDetail,
  builtInAddons,
  purchasableAddons,
  selectedAddonIds,
  isAnnual,
  onToggleAddon,
  onSelectAllAddons,
  onClearAddons,
}: LicenseCreateAddonsCardProps): JSX.Element {
  if (!hasSelectedProduct) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/40 p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Layers size={15} />
          <span>
            Pilih produk aplikasi software di atas untuk melihat modul add-on
            yang tersedia.
          </span>
        </div>
      </div>
    )
  }

  const isAllPurchasableSelected =
    purchasableAddons.length > 0 &&
    purchasableAddons.every((a) => selectedAddonIds.includes(a.id))

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-3.5 shadow-xs sm:p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Layers size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-foreground">
                Modul Add-on Ekosistem
              </h2>
              <Badge
                variant="secondary"
                className="px-1.5 py-0 font-mono text-[10px]"
              >
                {selectedAddonIds.length} Terpilih
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Pilih fitur modul tambahan untuk ditambahkan ke lisensi instance
              klien.
            </p>
          </div>
        </div>

        {/* Quick Batch Actions */}
        {purchasableAddons.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSelectAllAddons}
              disabled={isAllPurchasableSelected}
              className="h-7 cursor-pointer px-2 text-[11px]"
            >
              <Sparkles size={11} className="mr-1 text-primary" />
              Pilih Semua
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearAddons}
              disabled={selectedAddonIds.length === 0}
              className="h-7 cursor-pointer px-2 text-[11px] text-muted-foreground hover:text-destructive"
            >
              <X size={11} className="mr-1" />
              Kosongkan
            </Button>
          </div>
        )}
      </div>

      {isLoadingProductDetail ? (
        <div className="animate-pulse py-4 text-center text-xs text-muted-foreground">
          Memuat modul add-on produk...
        </div>
      ) : (
        <div className="space-y-3">
          {/* Built-in Modules (Ultra-Compact Inline Tags) */}
          {builtInAddons.length > 0 && (
            <div className="space-y-1.5">
              <span className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Modul Bawaan Pokok (Included Gratis)
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {builtInAddons.map((addon) => (
                  <span
                    key={addon.id}
                    className="inline-flex items-center gap-1 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-300"
                  >
                    <ShieldCheck
                      size={12}
                      className="shrink-0 text-emerald-600 dark:text-emerald-400"
                    />
                    <span>{addon.nama}</span>
                    <span className="font-mono text-[9px] opacity-70">
                      ({addon.code})
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Purchasable Modules (Compact Interactive Tiles) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold tracking-wider text-muted-foreground uppercase">
                Modul Berbayar Tambahan ({purchasableAddons.length} Tersedia)
              </span>
              <span className="text-muted-foreground">
                Tarif periode:{" "}
                <strong>{isAnnual ? "Tahunan" : "Bulanan"}</strong>
              </span>
            </div>

            {purchasableAddons.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-2.5 text-center text-[11px] text-muted-foreground">
                Produk ini belum memiliki modul add-on berbayar.
              </div>
            ) : (
              <TooltipProvider delayDuration={150}>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {purchasableAddons.map((addon) => {
                    const isSelected = selectedAddonIds.includes(addon.id)
                    const price = isAnnual
                      ? Number(addon.harga_tahunan) || 0
                      : Number(addon.harga_bulanan) || 0

                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => onToggleAddon(addon.id)}
                        className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-left shadow-2xs transition-all ${
                          isSelected
                            ? "border-primary/50 bg-primary/5 text-foreground ring-1 ring-primary/20"
                            : "border-border bg-card/70 text-foreground hover:border-border/80 hover:bg-muted/40"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40 bg-background"
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="truncate text-xs font-semibold">
                              {addon.nama}
                            </span>
                            <span className="py-0.2 shrink-0 rounded border border-border/50 bg-muted/60 px-1.5 font-mono text-[10px] text-muted-foreground">
                              {addon.code}
                            </span>
                          </div>

                          {addon.description ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="truncate text-[11px] leading-tight text-muted-foreground">
                                  {addon.description}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="max-w-xs text-xs"
                              >
                                <p>{addon.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <p className="text-[10px] text-muted-foreground/60 italic">
                              Tidak ada catatan
                            </p>
                          )}

                          <div className="pt-0.5 font-mono text-xs font-bold text-primary">
                            {price > 0 ? (
                              <span>
                                {formatCurrency(price)}
                                <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                                  /{isAnnual ? "tahun" : "bulan"}
                                </span>
                              </span>
                            ) : (
                              <span className="text-emerald-600 dark:text-emerald-400">
                                Gratis
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </TooltipProvider>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
