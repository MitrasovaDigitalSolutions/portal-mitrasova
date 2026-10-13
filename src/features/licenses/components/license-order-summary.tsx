"use client"

import type { JSX } from "react"
import { Info, Receipt } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils"
import type { OrderCalculationItem } from "../hooks/use-license-order"

interface LicenseOrderSummaryProps {
  items: OrderCalculationItem[]
  isAnnual: boolean
}

export function LicenseOrderSummary({
  items,
  isAnnual,
}: LicenseOrderSummaryProps): JSX.Element {
  return (
    <div className="space-y-2.5 rounded-xl border border-border bg-muted/20 p-3.5">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Receipt size={13} className="text-primary" />
          <span>Rincian Item yang Dipesan</span>
        </span>
        <Badge variant="outline" className="font-mono text-[10px] font-medium">
          {items.length} item ({isAnnual ? "12 Bulan" : "1 Bulan"})
        </Badge>
      </div>

      {items.length === 0 ? (
        <p className="py-2 text-center text-[11px] text-muted-foreground italic">
          Pilih paket pokok atau centang modul add-on untuk melihat rincian
          item.
        </p>
      ) : (
        <div className="space-y-1.5 text-xs">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-[11px]"
            >
              <span className="max-w-[220px] truncate text-muted-foreground">
                {item.name}
              </span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(item.subtotal)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-1.5 rounded-lg bg-muted/40 p-2 text-[11px] leading-normal text-muted-foreground">
        <Info size={13} className="mt-0.5 shrink-0 text-primary" />
        <span>
          Faktur tagihan / invoice unpaid akan otomatis diterbitkan. Begitu
          pembayaran dikonfirmasi lunas, sistem akan langsung memperpanjang masa
          aktif lisensi & modul add-on.
        </span>
      </div>
    </div>
  )
}
