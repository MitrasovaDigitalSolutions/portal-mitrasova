"use client"

import { useMemo, type JSX } from "react"
import { Calendar, CreditCard, Puzzle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, formatDate } from "@/utils"
import { useProduct } from "@/features/products"
import type { License } from "../@types/license"
import { KNOWN_PRODUCT_ADDONS, formatCodeToTitle } from "../constants"

interface LicenseDetailAddonsCardProps {
  license: License
  onOrderAddon?: (addonId?: string) => void
}

export function LicenseDetailAddonsCard({
  license,
  onOrderAddon,
}: LicenseDetailAddonsCardProps): JSX.Element {
  const { data: product, isLoading: isLoadingProduct } = useProduct(
    license.product_id,
    Boolean(license.product_id)
  )

  const currentAddons = useMemo(
    () => license.licenseAddons ?? license.license_addons ?? [],
    [license.licenseAddons, license.license_addons]
  )

  const activeMap = useMemo(() => {
    const map: Record<string, { status: string; expires_at: string | null }> = {}
    currentAddons.forEach((item) => {
      map[item.product_addon_id] = {
        status: item.status,
        expires_at: item.expires_at,
      }
    })
    return map
  }, [currentAddons])

  // Merge available addons from product with any existing assigned license addons
  const availableAddons = useMemo(() => {
    const list = [...(product?.addons ?? [])]
    const productAddonIds = new Set(list.map((a) => a.id))

    currentAddons.forEach((item) => {
      if (!productAddonIds.has(item.product_addon_id)) {
        const info = item.productAddon ?? item.product_addon
        list.push({
          id: item.product_addon_id,
          product_id: license.product_id,
          code: info?.code || "addon",
          nama: info?.nama || formatCodeToTitle(info?.code || "addon"),
          description: null,
          harga_bulanan: info?.harga || 0,
          harga_tahunan: 0,
          is_active: true,
          created_at: item.created_at,
          updated_at: item.updated_at,
        })
      }
    })

    return list
  }, [product?.addons, currentAddons, license.product_id])

  const activeCount = useMemo(() => {
    return availableAddons.filter(
      (addon) => activeMap[addon.id]?.status === "active"
    ).length
  }, [availableAddons, activeMap])

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <Puzzle size={15} className="text-muted-foreground shrink-0" />
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Modul Addon Instance
          </h2>
          <Badge
            variant="secondary"
            className="text-[11px] font-mono px-2 py-0.5 rounded-md"
          >
            {activeCount} dari {availableAddons.length} Aktif
          </Badge>
        </div>

        {onOrderAddon && (
          <Button
            type="button"
            size="sm"
            onClick={() => onOrderAddon()}
            className="h-8 px-3 text-xs gap-1.5 cursor-pointer font-medium self-start sm:self-auto shadow-xs"
          >
            <CreditCard size={13} />
            <span>Beli / Tambah Add-on</span>
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoadingProduct ? (
        <div className="space-y-2.5 py-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between gap-3 animate-pulse"
            >
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-36 rounded" />
                <Skeleton className="h-3 w-56 rounded" />
              </div>
              <Skeleton className="h-7 w-20 rounded" />
            </div>
          ))}
        </div>
      ) : availableAddons.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center text-xs text-muted-foreground space-y-1.5">
          <Puzzle size={24} className="mx-auto opacity-40 mb-1" />
          <p className="font-medium text-foreground">
            Belum Ada Modul Addon
          </p>
          <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
            Produk software ini belum memiliki modul pelengkap yang terdaftar di sistem.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {availableAddons.map((addon) => {
            const currentItem = activeMap[addon.id]
            const isActive = currentItem?.status === "active"
            const knownAddon = KNOWN_PRODUCT_ADDONS[addon.code]
            const addonName =
              addon.nama || knownAddon?.nama || formatCodeToTitle(addon.code)
            const addonDesc =
              addon.description || knownAddon?.description

            return (
              <div
                key={addon.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isActive
                    ? "bg-primary/5 border-primary/30 shadow-2xs"
                    : "bg-muted/15 border-border/70 hover:border-border"
                }`}
              >
                {/* Left: Info */}
                <div className="space-y-1 min-w-0 flex-1 pr-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-xs text-foreground truncate">
                      {addonName}
                    </span>

                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] px-1.5 py-0 bg-background/60 text-muted-foreground border-border/80"
                    >
                      {addon.code}
                    </Badge>

                    <Badge
                      variant={isActive ? "default" : "secondary"}
                      className={
                        isActive
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0 font-medium"
                          : "text-[10px] px-1.5 py-0 font-medium text-muted-foreground"
                      }
                    >
                      {isActive ? "Aktif" : "Belum Aktif"}
                    </Badge>
                  </div>

                  {addonDesc && (
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {addonDesc}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
                    {addon.harga_bulanan > 0 && (
                      <span>
                        Harga:{" "}
                        <strong className="text-foreground font-semibold font-mono">
                          {formatCurrency(addon.harga_bulanan)}
                        </strong>
                        /bln
                        {addon.harga_tahunan > 0 && (
                          <span className="ml-1 text-muted-foreground">
                            •{" "}
                            <strong className="text-foreground font-semibold font-mono">
                              {formatCurrency(addon.harga_tahunan)}
                            </strong>
                            /thn
                          </span>
                        )}
                      </span>
                    )}

                    {currentItem?.expires_at && (
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        <span>Masa Aktif: {formatDate(currentItem.expires_at)}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Order / Extend Button */}
                {onOrderAddon && (
                  <div className="shrink-0">
                    <Button
                      type="button"
                      variant={isActive ? "outline" : "default"}
                      size="sm"
                      onClick={() => onOrderAddon(addon.id)}
                      className="h-7 px-2.5 text-xs cursor-pointer gap-1"
                    >
                      <CreditCard size={12} />
                      <span>{isActive ? "Perpanjang" : "Beli Addon"}</span>
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
