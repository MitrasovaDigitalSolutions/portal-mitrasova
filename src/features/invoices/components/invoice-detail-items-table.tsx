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
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground">
              <th className="py-2.5 px-3">Deskripsi</th>
              <th className="py-2.5 px-3 text-center w-20">Jumlah</th>
              <th className="py-2.5 px-3 text-right w-36">Harga Satuan</th>
              <th className="py-2.5 px-3 text-right w-36">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items && items.length > 0 ? (
              items.map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/30">
                  <td className="py-2.5 px-3 font-medium text-foreground">
                    {item.description}
                  </td>
                  <td className="py-2.5 px-3 text-center text-muted-foreground">
                    {item.quantity}
                  </td>
                  <td className="py-2.5 px-3 text-right text-muted-foreground font-mono">
                    {formatCurrency(item.unit_price)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-foreground font-mono">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-3 px-3 font-medium text-foreground" colSpan={3}>
                  Layanan & Biaya Lisensi Sistem
                </td>
                <td className="py-3 px-3 text-right font-bold text-foreground font-mono">
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
