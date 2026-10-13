"use client"

import { useMemo, useState, type JSX } from "react"
import { Calendar, CreditCard, Loader2, Puzzle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatCurrency, formatDate } from "@/utils"
import { useProduct } from "@/features/products"
import type { License } from "../@types/license"
import { KNOWN_PRODUCT_ADDONS, formatCodeToTitle } from "../constants"
import { useToggleLicenseAddon } from "../api/license.queries"

interface LicenseDetailAddonsCardProps {
  license: License
  onOrderAddon?: (addonId?: string) => void
}

export function LicenseDetailAddonsCard({
  license,
  onOrderAddon,
}: LicenseDetailAddonsCardProps): JSX.Element {
  const [togglingAddonId, setTogglingAddonId] = useState<string | null>(null)
  const { mutate: toggleAddon, isPending: isToggling } = useToggleLicenseAddon()

  const { data: product, isLoading: isLoadingProduct } = useProduct(
    license.product_id,
    Boolean(license.product_id)
  )

  const currentAddons = useMemo(
    () => license.licenseAddons ?? license.license_addons ?? [],
    [license.licenseAddons, license.license_addons]
  )

  const activeMap = useMemo(() => {
    const map: Record<string, { status: string; expires_at: string | null }> =
      {}
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

  const handleToggle = (addonId: string, checked: boolean) => {
    setTogglingAddonId(addonId)
    toggleAddon(
      {
        licenseId: license.id,
        productAddonId: addonId,
        payload: {
          is_enabled: checked,
          status: checked ? "active" : "disabled",
        },
      },
      {
        onSettled: () => {
          setTogglingAddonId(null)
        },
      }
    )
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Puzzle size={15} className="shrink-0 text-muted-foreground" />
          <h2 className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Modul Addon Instance
          </h2>
          <Badge
            variant="secondary"
            className="rounded-md px-2 py-0.5 font-mono text-[11px]"
          >
            {activeCount} dari {availableAddons.length} Aktif
          </Badge>
        </div>

        {onOrderAddon && (
          <Button
            type="button"
            size="sm"
            onClick={() => onOrderAddon()}
            className="h-8 cursor-pointer gap-1.5 self-start px-3 text-xs font-medium shadow-xs sm:self-auto"
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
              className="flex animate-pulse items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-3"
            >
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-36 rounded" />
                <Skeleton className="h-3 w-56 rounded" />
              </div>
              <Skeleton className="h-7 w-20 rounded" />
            </div>
          ))}
        </div>
      ) : availableAddons.length === 0 ? (
        <div className="space-y-1.5 rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center text-xs text-muted-foreground">
          <Puzzle size={24} className="mx-auto mb-1 opacity-40" />
          <p className="font-medium text-foreground">Belum Ada Modul Addon</p>
          <p className="mx-auto max-w-sm text-[11px] text-muted-foreground">
            Produk software ini belum memiliki modul pelengkap yang terdaftar di
            sistem.
          </p>
        </div>
      ) : (
        <TooltipProvider delayDuration={200}>
          <div className="space-y-2">
            {availableAddons.map((addon) => {
              const currentItem = activeMap[addon.id]
              const isPurchased = Boolean(currentItem)
              const isExpired = Boolean(
                currentItem?.expires_at &&
                new Date(currentItem.expires_at).getTime() < Date.now()
              )
              const isActive = currentItem?.status === "active" && !isExpired
              const isDisabled = currentItem?.status === "disabled"
              const isItemToggling = togglingAddonId === addon.id

              const knownAddon = KNOWN_PRODUCT_ADDONS[addon.code]
              const addonName =
                addon.nama || knownAddon?.nama || formatCodeToTitle(addon.code)
              const addonDesc = addon.description || knownAddon?.description

              // Tooltip reason if toggle is disabled
              let toggleDisabledReason: string | null = null
              if (license.status === "suspended") {
                toggleDisabledReason =
                  "Lisensi sedang ditangguhkan (suspended). Tidak dapat mengubah status add-on."
              } else if (isExpired && !isActive) {
                toggleDisabledReason =
                  "Langganan add-on telah kedaluwarsa. Perpanjang lisensi/addon terlebih dahulu untuk mengaktifkan kembali."
              }

              return (
                <div
                  key={addon.id}
                  className={`flex flex-col justify-between gap-3 rounded-xl border p-3 transition-all sm:flex-row sm:items-center ${
                    isActive
                      ? "border-primary/30 bg-primary/5 shadow-2xs"
                      : "border-border/70 bg-muted/15 hover:border-border"
                  }`}
                >
                  {/* Left: Info */}
                  <div className="min-w-0 flex-1 space-y-1 pr-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-xs font-semibold text-foreground">
                        {addonName}
                      </span>

                      <Badge
                        variant="outline"
                        className="border-border/80 bg-background/60 px-1.5 py-0 font-mono text-[10px] text-muted-foreground"
                      >
                        {addon.code}
                      </Badge>

                      {/* Status Badge */}
                      {isPurchased ? (
                        isExpired ? (
                          <Badge
                            variant="destructive"
                            className="px-1.5 py-0 text-[10px] font-medium"
                          >
                            Kedaluwarsa
                          </Badge>
                        ) : isActive ? (
                          <Badge
                            variant="default"
                            className="border border-emerald-500/20 bg-emerald-500/15 px-1.5 py-0 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
                          >
                            Aktif
                          </Badge>
                        ) : isDisabled ? (
                          <Badge
                            variant="secondary"
                            className="border border-amber-500/20 bg-amber-500/15 px-1.5 py-0 text-[10px] font-medium text-amber-600 dark:text-amber-400"
                          >
                            Dinonaktifkan
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="px-1.5 py-0 text-[10px] font-medium text-muted-foreground"
                          >
                            Nonaktif
                          </Badge>
                        )
                      ) : (
                        <Badge
                          variant="secondary"
                          className="px-1.5 py-0 text-[10px] font-medium text-muted-foreground"
                        >
                          Belum Dibeli
                        </Badge>
                      )}
                    </div>

                    {addonDesc && (
                      <p className="line-clamp-1 text-[11px] text-muted-foreground">
                        {addonDesc}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[11px] text-muted-foreground">
                      {addon.harga_bulanan > 0 && (
                        <span>
                          Harga:{" "}
                          <strong className="font-mono font-semibold text-foreground">
                            {formatCurrency(addon.harga_bulanan)}
                          </strong>
                          /bln
                          {addon.harga_tahunan > 0 && (
                            <span className="ml-1 text-muted-foreground">
                              •{" "}
                              <strong className="font-mono font-semibold text-foreground">
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
                          <span>
                            Masa Aktif: {formatDate(currentItem.expires_at)}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex shrink-0 items-center gap-3 self-end sm:self-center">
                    {/* Toggle Switch for Purchased Addons */}
                    {isPurchased && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-background/80 px-2 py-1">
                            {isItemToggling ? (
                              <Loader2
                                size={13}
                                className="animate-spin text-primary"
                              />
                            ) : null}
                            <span className="text-[11px] font-medium text-muted-foreground">
                              {isActive ? "Aktif" : "Nonaktif"}
                            </span>
                            <Switch
                              checked={isActive}
                              disabled={
                                isToggling ||
                                license.status === "suspended" ||
                                (!isActive && isExpired)
                              }
                              onCheckedChange={(checked) =>
                                handleToggle(addon.id, checked)
                              }
                              aria-label={`Toggle addon ${addonName}`}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs text-xs">
                          {toggleDisabledReason ||
                            (isActive
                              ? "Nonaktifkan modul ini (masa aktif langganan tidak terpengaruh)."
                              : "Aktifkan kembali modul addon ini.")}
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* Order / Extend Button */}
                    {onOrderAddon && (
                      <Button
                        type="button"
                        variant={isPurchased ? "outline" : "default"}
                        size="sm"
                        onClick={() => onOrderAddon(addon.id)}
                        className="h-8 cursor-pointer gap-1 px-2.5 text-xs shadow-2xs"
                      >
                        <CreditCard size={12} />
                        <span>{isPurchased ? "Perpanjang" : "Beli Addon"}</span>
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </TooltipProvider>
      )}
    </div>
  )
}
