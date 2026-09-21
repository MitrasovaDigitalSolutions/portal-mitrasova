"use client"

import type { JSX } from "react"
import { CalendarClock, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/utils"
import {
  BASE_PRODUCT_ANNUAL_PRICE,
  BASE_PRODUCT_MONTHLY_PRICE,
} from "../hooks/use-license-order"

interface LicenseOrderBaseProductProps {
  productName: string
  currentExpiryText: string
  isAnnual: boolean
  includeBase: boolean
  onToggleIncludeBase: (val: boolean) => void
}

export function LicenseOrderBaseProduct({
  productName,
  currentExpiryText,
  isAnnual,
  includeBase,
  onToggleIncludeBase,
}: LicenseOrderBaseProductProps): JSX.Element {
  const price = isAnnual
    ? BASE_PRODUCT_ANNUAL_PRICE
    : BASE_PRODUCT_MONTHLY_PRICE

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-foreground">
        Paket Lisensi Pokok
      </label>
      <div
        onClick={() => onToggleIncludeBase(!includeBase)}
        className={cn(
          "flex items-center justify-between rounded-xl border p-3.5 transition-all cursor-pointer",
          includeBase
            ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
            : "border-border bg-card hover:bg-muted/30"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <Package size={16} />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-foreground">
                {productName}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono">
                {isAnnual ? "+12 Bulan" : "+1 Bulan"}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <CalendarClock size={12} className="text-muted-foreground" />
              <span>Masa aktif saat ini:</span>
              <span className="font-mono font-medium text-foreground">
                {currentExpiryText}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-bold text-xs text-primary font-mono">
              {formatCurrency(price)}
            </div>
            <div className="text-[10px] text-muted-foreground">
              /{isAnnual ? "tahun" : "bulan"}
            </div>
          </div>
          <Switch
            checked={includeBase}
            onCheckedChange={onToggleIncludeBase}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  )
}
