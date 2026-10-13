"use client"

import type React from "react"
import { Building, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InvoiceStatusBadge } from "./invoice-status-badge"
import type { Invoice } from "../@types/invoice"
import { formatCurrency, formatDate } from "@/utils"

interface InvoiceMobileCardProps {
  invoice: Invoice
  onViewDetail: (inv: Invoice) => void
  onMarkPaid: (inv: Invoice) => void
  onCancel: (inv: Invoice) => void
  onDownloadPdf: (inv: Invoice) => void
  onDelete: (inv: Invoice) => void
}

export function InvoiceMobileCard({
  invoice,
  onViewDetail,
  onMarkPaid,
  onCancel,
  onDownloadPdf,
  onDelete,
}: InvoiceMobileCardProps): React.JSX.Element {
  const isPaid = invoice.status === "paid"
  const isUnpaid = invoice.status === "unpaid"

  return (
    <div className="space-y-2.5 rounded-xl border border-border bg-card p-3 shadow-2xs transition-colors hover:border-primary/40 sm:p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onViewDetail(invoice)}
            className="cursor-pointer text-left font-mono text-xs font-bold text-primary hover:underline"
          >
            {invoice.invoice_number}
          </button>
          <div className="text-[11px] text-muted-foreground">
            {formatDate(invoice.created_at)}
          </div>
        </div>
        <InvoiceStatusBadge status={invoice.status} />
      </div>

      <div className="space-y-1 border-y border-border/60 py-2 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          <Building className="size-3.5 text-muted-foreground" />
          <span>
            {invoice.client?.nama_pemilik || invoice.client?.nama_usaha || "—"}
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3" /> Jatuh Tempo:
          </span>
          <span className="font-medium text-foreground">
            {formatDate(invoice.due_date)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1 font-bold">
          <span className="text-foreground">Total:</span>
          <span className="font-mono text-primary">
            {formatCurrency(invoice.total_amount)}
          </span>
        </div>
      </div>

      {/* Mobile Card Actions */}
      <div className="flex flex-wrap items-center justify-end gap-1.5 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 cursor-pointer px-2 text-[11px]"
          onClick={() => onViewDetail(invoice)}
        >
          Detail
        </Button>
        {isUnpaid && (
          <Button
            type="button"
            size="sm"
            className="h-7 cursor-pointer bg-emerald-600 px-2 text-[11px] font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500"
            onClick={() => onMarkPaid(invoice)}
          >
            Lunasi
          </Button>
        )}
        {isUnpaid && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 cursor-pointer px-2 text-[11px] text-destructive hover:bg-destructive/10"
            onClick={() => onCancel(invoice)}
          >
            Batal
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 cursor-pointer px-2 text-[11px] text-muted-foreground hover:text-foreground"
          onClick={() => onDownloadPdf(invoice)}
        >
          PDF
        </Button>
        {!isPaid && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="h-7 cursor-pointer px-2 text-[11px]"
            onClick={() => onDelete(invoice)}
          >
            Hapus
          </Button>
        )}
      </div>
    </div>
  )
}
