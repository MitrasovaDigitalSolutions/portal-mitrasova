"use client"

import type React from "react"
import { FileText } from "lucide-react"
import type { InvoiceItem } from "../@types/invoice"
import { formatCurrency } from "@/utils"

interface InvoiceDetailItemsTableProps {
  items: InvoiceItem[] | null
  totalAmount: number
}

export function InvoiceDetailItemsTable({
  items,
  totalAmount,
}: InvoiceDetailItemsTableProps): React.JSX.Element {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 font-semibold text-foreground">
        <FileText className="size-3.5 text-primary" />
        Rincian Item Faktur
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground">
              <th className="px-3 py-2.5">Deskripsi</th>
              <th className="w-20 px-3 py-2.5 text-center">Jumlah</th>
              <th className="w-36 px-3 py-2.5 text-right">Harga Satuan</th>
              <th className="w-36 px-3 py-2.5 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items && items.length > 0 ? (
              items.map((item, idx) => {
                const qty = item.qty ?? item.quantity ?? 1
                const price = item.price ?? item.unit_price ?? 0
                const subtotal = item.subtotal ?? item.amount ?? qty * price

                return (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="px-3 py-2.5 font-medium text-foreground">
                      {item.name || item.description || "Item Tagihan"}
                    </td>
                    <td className="px-3 py-2.5 text-center text-muted-foreground">
                      {qty}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                      {formatCurrency(price)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-semibold text-foreground">
                      {formatCurrency(subtotal)}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  className="px-3 py-3 font-medium text-foreground"
                  colSpan={3}
                >
                  Layanan & Biaya Lisensi Sistem
                </td>
                <td className="px-3 py-3 text-right font-mono font-bold text-foreground">
                  {formatCurrency(totalAmount)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
