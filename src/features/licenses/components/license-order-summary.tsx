"use client"

import type { JSX } from "react"
import { Info, Receipt } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils"
import type { OrderCalculationItem } from "../hooks/use-license-order"

interface LicenseOrderSummaryProps {
  items: OrderCalculationItem[]
  grandTotal: number
  isAnnual: boolean
}

export function LicenseOrderSummary({
  items,
  grandTotal,
  isAnnual,
}: LicenseOrderSummaryProps): JSX.Element {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-3.5 space-y-2.5">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
          <Receipt size={13} className="text-primary" />
          <span>Rincian Tagihan Pesanan</span>
        </span>
        <Badge variant="outline" className="text-[10px] capitalize font-medium">
          {isAnnual ? "12 Bulan" : "1 Bulan"}
        </Badge>
      </div>

      {items.length === 0 ? (
        <p className="text-[11px] text-muted-foreground italic text-center py-1">
          Pilih paket pokok atau modul add-on di atas untuk melihat rincian tagihan.
        </p>
      ) : (
        <div className="space-y-1.5 text-xs">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-[11px]"
            >
              <span className="text-muted-foreground truncate max-w-[260px]">
                {item.name}
              </span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(item.subtotal)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border pt-2">
        <span className="font-bold text-xs text-foreground">Total Tagihan:</span>
        <span className="font-mono text-sm font-extrabold text-primary">
          {formatCurrency(grandTotal)}
        </span>
      </div>

      <div className="flex items-start gap-1.5 rounded-lg bg-muted/40 p-2 text-[11px] text-muted-foreground leading-normal">
        <Info size={13} className="shrink-0 text-primary mt-0.5" />
        <span>
          Faktur tagihan / invoice unpaid akan otomatis diterbitkan. Begitu pembayaran dikonfirmasi lunas, sistem akan langsung memperpanjang masa aktif lisensi & modul add-on.
        </span>
      </div>
    </div>
  )
}
