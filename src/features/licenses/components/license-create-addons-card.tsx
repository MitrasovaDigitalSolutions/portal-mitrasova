"use client"

import type { JSX } from "react"
import { Check, Layers, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
}

export function LicenseCreateAddonsCard({
  hasSelectedProduct,
  isLoadingProductDetail,
  builtInAddons,
  purchasableAddons,
  selectedAddonIds,
  isAnnual,
  onToggleAddon,
}: LicenseCreateAddonsCardProps): JSX.Element {
  if (!hasSelectedProduct) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center space-y-2">
        <div className="flex size-10 mx-auto items-center justify-center rounded-xl bg-muted/60 text-muted-foreground">
          <Layers size={20} />
        </div>
        <div className="text-xs font-semibold text-foreground">
          Pilih Produk Aplikasi Terlebih Dahulu
        </div>
        <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
          Daftar modul add-on yang tersedia akan otomatis dimuat sesuai dengan produk yang Anda pilih di atas.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Layers size={15} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-foreground">
              4. Pemilihan Modul Add-on Tambahan
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Pilih modul add-on opsional untuk diaktifkan dan ditagihkan pada invoice awal.
            </p>
          </div>
        </div>

        <Badge variant="secondary" className="font-mono text-xs">
          {selectedAddonIds.length} Terpilih
        </Badge>
      </div>

      {isLoadingProductDetail ? (
        <div className="py-6 text-center text-xs text-muted-foreground animate-pulse">
          Memuat daftar add-on produk...
        </div>
      ) : (
        <div className="space-y-4">
          {/* Built-in Addons */}
          {builtInAddons.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Modul Bawaan Produk (Included Gratis)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {builtInAddons.map((addon) => (
                  <div
                    key={addon.id}
                    className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-foreground truncate">
                          {addon.nama}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {addon.code}
                        </div>
                      </div>
                    </div>
                    <Badge variant="success" className="text-[9px] px-1.5 py-0">
                      Auto-Active
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Purchasable Addons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-muted-foreground uppercase tracking-wider">
                Modul Add-on Berbayar ({purchasableAddons.length} Tersedia)
              </span>
              <span className="text-muted-foreground text-[10px]">
                Tarif disesuaikan dengan periode ({isAnnual ? "Tahunan" : "Bulanan"})
              </span>
            </div>

            {purchasableAddons.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-3 text-center text-[11px] text-muted-foreground">
                Produk ini belum memiliki modul add-on berbayar.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <TooltipProvider delayDuration={200}>
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
                        className={`text-left rounded-xl p-3 border transition-all cursor-pointer flex items-start justify-between gap-2 shadow-2xs ${
                          isSelected
                            ? "border-sky-500/60 bg-sky-500/10 text-sky-950 dark:text-sky-50 ring-1 ring-sky-500/30"
                            : "border-border bg-card/60 hover:bg-muted/40 text-foreground"
                        }`}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs truncate">
                              {addon.nama}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              ({addon.code})
                            </span>
                          </div>

                          {addon.description ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-[11px] text-muted-foreground truncate leading-tight">
                                  {addon.description}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs text-xs">
                                <p>{addon.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <p className="text-[11px] text-muted-foreground/60 italic">
                              Tidak ada deskripsi
                            </p>
                          )}

                          <div className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 pt-0.5">
                            {price > 0 ? (
                              <span>
                                {formatCurrency(price)}
                                <span className="text-[10px] font-normal text-muted-foreground">
                                  /{isAnnual ? "thn" : "bln"}
                                </span>
                              </span>
                            ) : (
                              <span className="text-emerald-600 dark:text-emerald-400">
                                Gratis
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          className={`size-5 rounded-md border flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                            isSelected
                              ? "bg-sky-600 text-white border-sky-600"
                              : "border-muted-foreground/40 bg-background"
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </button>
                    )
                  })}
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
