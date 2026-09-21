"use client"

import * as React from "react"
import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import { InvoiceStatusBadge } from "./invoice-status-badge"
import { InvoiceDetailClientInfo } from "./invoice-detail-client-info"
import { InvoiceDetailItemsTable } from "./invoice-detail-items-table"
import { formatCurrency, formatDate } from "@/utils"
import type { Invoice } from "../@types/invoice"
import {
  Check,
  Clock,
  Copy,
  CreditCard,
  FileText,
  CheckCircle2,
  Ban,
  Download,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { invoiceApi } from "../api/invoice.api"

interface InvoiceDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  onMarkPaidClick?: (invoice: Invoice) => void
  onCancelClick?: (invoice: Invoice) => void
}

export function InvoiceDetailDialog({
  open,
  onOpenChange,
  invoice,
  onMarkPaidClick,
  onCancelClick,
}: InvoiceDetailDialogProps): React.JSX.Element {
  const [copiedInvoiceNumber, setCopiedInvoiceNumber] = React.useState(false)
  const [isDownloadingPdf, setIsDownloadingPdf] = React.useState(false)

  if (!invoice) {
    return <></>
  }

  const copyInvoiceNumber = (text: string) => {
    void navigator.clipboard.writeText(text)
    setCopiedInvoiceNumber(true)
    setTimeout(() => setCopiedInvoiceNumber(false), 2000)
    toast.success("Nomor invoice disalin")
  }

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true)
      await invoiceApi.downloadPdf(invoice.id, invoice.invoice_number)
      toast.success(`PDF invoice ${invoice.invoice_number} berhasil diunduh`)
    } catch {
      toast.error("Gagal mengunduh PDF invoice")
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  const isPaid = invoice.status === "paid"

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-2xl"
      title={
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <span className="font-mono font-bold text-sm tracking-tight">
            {invoice.invoice_number}
          </span>
          <button
            type="button"
            onClick={() => copyInvoiceNumber(invoice.invoice_number)}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Salin Nomor Faktur"
          >
            {copiedInvoiceNumber ? (
              <Check className="size-3 text-emerald-500" />
            ) : (
              <Copy className="size-3" />
            )}
          </button>
        </div>
      }
      headerRight={<InvoiceStatusBadge status={invoice.status} />}
    >
      <div className="space-y-5 pt-2 text-xs">
        {/* Creation Date Banner */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl border border-border/80 bg-muted/20 text-muted-foreground">
          <span>Tanggal Diterbitkan:</span>
          <span className="font-semibold text-foreground">
            {formatDate(invoice.created_at)}
          </span>
        </div>

        {/* Client & License Info Cards */}
        <InvoiceDetailClientInfo
          client={invoice.client}
          license={invoice.license}
        />

        {/* Line Items Table */}
        <InvoiceDetailItemsTable
          items={invoice.items}
          totalAmount={invoice.total_amount}
        />

        {/* Payment Details & Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2">
            <div className="text-xs font-semibold text-foreground border-b border-border/60 pb-1.5">
              Detail Pembayaran
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CreditCard className="size-3.5" /> Metode:
              </span>
              <span className="font-semibold text-foreground">
                {invoice.payment_method || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-3.5" /> Jatuh Tempo:
              </span>
              <span className="font-medium text-foreground">
                {formatDate(invoice.due_date)}
              </span>
            </div>
            {invoice.paid_at && (
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5" /> Tanggal Lunas:
                </span>
                <span className="font-semibold">
                  {formatDate(invoice.paid_at)}
                </span>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col justify-center space-y-1">
            <div className="text-xs text-muted-foreground font-medium">
              Total Tagihan
            </div>
            <div className="text-2xl font-bold font-mono text-primary">
              {formatCurrency(invoice.total_amount)}
            </div>
            <div className="text-[11px] text-muted-foreground pt-1">
              {isPaid ? "Status: Lunas / Terverifikasi" : "Status: Menunggu Pembayaran"}
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
            <div className="font-semibold text-foreground text-xs">Catatan:</div>
            <p className="text-xs text-muted-foreground whitespace-pre-wrap">
              {invoice.notes}
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-end gap-2 p-3 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            {!isPaid && onMarkPaidClick && (
              <Button
                type="button"
                className="h-9 px-4 gap-2 text-xs font-semibold cursor-pointer rounded-xl shadow-xs"
                onClick={() => {
                  onOpenChange(false)
                  onMarkPaidClick(invoice)
                }}
              >
                <CheckCircle2 className="size-3.5" />
                <span>Tandai Lunas</span>
              </Button>
            )}

            {!isPaid && onCancelClick && (
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 gap-2 text-xs font-semibold cursor-pointer rounded-xl text-destructive hover:bg-destructive/10"
                onClick={() => {
                  onOpenChange(false)
                  onCancelClick(invoice)
                }}
              >
                <Ban className="size-3.5" />
                <span>Batalkan Invoice</span>
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              className="h-9 px-4 gap-2 text-xs font-semibold cursor-pointer rounded-xl text-muted-foreground hover:text-foreground"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
            >
              {isDownloadingPdf ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              <span>Unduh PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </BaseDialog>
  )
}
