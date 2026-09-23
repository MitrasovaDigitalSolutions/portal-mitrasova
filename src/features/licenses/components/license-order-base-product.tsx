"use client"

import type { JSX } from "react"
import { CalendarClock, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { FormSwitch } from "@/components/forms/form-switch"
import { formatCurrency } from "@/utils"
import type { LicenseOrderValues } from "../validations/license-order.schema"

interface LicenseOrderBaseProductProps {
  productName: string
  currentExpiryText: string
  isAnnual: boolean
  price?: number
}

export function LicenseOrderBaseProduct({
  productName,
  currentExpiryText,
  isAnnual,
  price = 0,
}: LicenseOrderBaseProductProps): JSX.Element {

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-foreground">
        Paket Lisensi Pokok
      </label>
      <FormSwitch<LicenseOrderValues>
        name="include_base_product"
        label={
          <div className="flex items-center gap-2">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
              <Package size={13} />
            </div>
            <span className="font-semibold text-xs text-foreground truncate">
              {productName}
            </span>
            <Badge variant="outline" className="text-[10px] font-mono shrink-0">
              {isAnnual ? "+12 Bulan" : "+1 Bulan"}
            </Badge>
          </div>
        }
        description={
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-0.5">
            <CalendarClock size={12} className="text-muted-foreground shrink-0" />
            <span>Masa aktif:</span>
            <span className="font-mono font-medium text-foreground">
              {currentExpiryText}
            </span>
          </div>
        }
        rightElement={
          <div className="text-right">
            <div className="font-bold text-xs text-primary font-mono">
              {price > 0 ? formatCurrency(price) : "Rp 0"}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {price > 0 ? `/${isAnnual ? "tahun" : "bulan"}` : "Termasuk"}
            </div>
          </div>
        }
        className="bg-card hover:bg-muted/30 transition-colors"
      />
    </div>
  )
}
