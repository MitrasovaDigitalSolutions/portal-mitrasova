"use client"

import type { JSX } from "react"
import {
  Ban,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Loader2,
  Receipt,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { InvoiceStatusBadge } from "@/features/invoices/components/invoice-status-badge"
import { formatCurrency, formatDate } from "@/utils"
import type { Invoice } from "@/features/invoices/@types/invoice"

interface LicenseDetailInvoicesCardProps {
  invoices: Invoice[]
  downloadingPdfId: string | null
  onMarkPaid: (invoice: Invoice) => void
  onCancelInvoice: (invoice: Invoice) => void
  onDownloadPdf: (invoice: Invoice) => void
  onViewDetail: (invoice: Invoice) => void
}

export function LicenseDetailInvoicesCard({
  invoices,
  downloadingPdfId,
  onMarkPaid,
  onCancelInvoice,
  onDownloadPdf,
  onViewDetail,
}: LicenseDetailInvoicesCardProps): JSX.Element {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <Receipt size={15} className="text-muted-foreground" />
          <h2 className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Tagihan & Faktur Invoice ({invoices.length})
          </h2>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
          <p>Belum ada tagihan invoice untuk lisensi ini.</p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {invoices.map((inv) => {
            const isUnpaid = inv.status === "unpaid"
            const isDownloading = downloadingPdfId === inv.id

            return (
              <div
                key={inv.id}
                className="flex flex-col justify-between gap-3 py-3 text-xs sm:flex-row sm:items-center"
              >
                {/* Left: Invoice info */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewDetail(inv)}
                      className="cursor-pointer text-xs font-semibold text-primary hover:underline"
                    >
                      {inv.invoice_number}
                    </button>
                    <InvoiceStatusBadge status={inv.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> Jatuh tempo:{" "}
                      {formatDate(inv.due_date)}
                    </span>
                    {inv.paid_at && (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        • Lunas: {formatDate(inv.paid_at)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                  <div className="text-left sm:text-right">
                    <span className="block text-xs font-semibold text-foreground">
                      {formatCurrency(inv.total_amount)}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {/* Mark Paid button for unpaid */}
                    {isUnpaid && (
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => onMarkPaid(inv)}
                        className="h-7 cursor-pointer gap-1 bg-emerald-600 px-2.5 text-xs text-white hover:bg-emerald-700"
                      >
                        <CheckCircle2 size={12} />
                        <span>Bayar</span>
                      </Button>
                    )}

                    {/* Cancel Invoice button for unpaid */}
                    {isUnpaid && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onCancelInvoice(inv)}
                        className="h-7 cursor-pointer gap-1 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Ban size={12} />
                        <span>Batal</span>
                      </Button>
                    )}

                    {/* Download PDF button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isDownloading}
                      onClick={() => onDownloadPdf(inv)}
                      className="h-7 cursor-pointer gap-1 px-2 text-xs"
                      title="Unduh PDF Faktur"
                    >
                      {isDownloading ? (
                        <Loader2
                          size={12}
                          className="animate-spin text-primary"
                        />
                      ) : (
                        <Download size={12} />
                      )}
                      <span>PDF</span>
                    </Button>

                    {/* View Detail button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetail(inv)}
                      className="h-7 cursor-pointer gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                      title="Lihat Rincian Faktur"
                    >
                      <FileText size={12} />
                      <span>Rincian</span>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
