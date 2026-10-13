"use client"

import * as React from "react"
import {
  Ban,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileText,
  Loader2,
  Receipt,
  ShoppingCart,
} from "lucide-react"
import { toast } from "sonner"

import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import { Scrollable } from "@/components/ui/scrollable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { formatCurrency, formatDate } from "@/utils"

import type { Invoice } from "../@types/invoice"
import { invoiceApi } from "../api/invoice.api"
import { InvoiceDetailClientInfo } from "./invoice-detail-client-info"
import { InvoiceDetailItemsTable } from "./invoice-detail-items-table"
import { InvoiceStatusBadge } from "./invoice-status-badge"

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
  const itemCount = invoice.items?.length ?? 1

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      scrollable={false}
      className="flex max-h-[90vh] flex-col sm:max-w-xl md:max-w-2xl"
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <FileText className="size-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm font-bold tracking-tight text-foreground">
              {invoice.invoice_number}
            </span>
            <button
              type="button"
              onClick={() => copyInvoiceNumber(invoice.invoice_number)}
              className="cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Salin Nomor Faktur"
            >
              {copiedInvoiceNumber ? (
                <Check className="size-3 text-emerald-500" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          </div>
        </div>
      }
      headerRight={<InvoiceStatusBadge status={invoice.status} />}
    >
      <div className="flex min-h-0 flex-1 flex-col pt-1 text-xs">
        {/* Tabs: Tab 1 = Rincian & Biaya, Tab 2 = Item yang Diorder */}
        <Tabs
          defaultValue="overview"
          className="flex min-h-0 w-full flex-1 flex-col"
        >
          <div className="shrink-0 pb-1.5">
            <TabsList className="grid h-8.5 w-full grid-cols-2 rounded-xl border border-border/80 bg-muted/60 p-1">
              <TabsTrigger value="overview" className="gap-1.5 text-xs">
                <Receipt className="size-3.5" />
                <span>Rincian & Total Biaya</span>
              </TabsTrigger>
              <TabsTrigger value="items" className="gap-1.5 text-xs">
                <ShoppingCart className="size-3.5" />
                <span>Item yang Diorder</span>
                <span className="py-0.2 ml-1 rounded-full border border-border/60 bg-background px-1.5 text-[10px] font-medium">
                  {itemCount}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: Rincian & Total Biaya with dedicated Scrollable */}
          <TabsContent value="overview" className="mt-0 min-h-0 flex-1">
            <Scrollable className="max-h-[50vh] pr-1.5 sm:max-h-[54vh]">
              <div className="space-y-3 pr-1 pb-1">
                {/* Hero Total Card */}
                <div className="space-y-3 rounded-xl border border-border/80 bg-gradient-to-br from-emerald-500/5 via-card to-primary/5 p-3.5 shadow-2xs">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <span className="block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Total Biaya Tagihan
                      </span>
                      <div className="font-mono text-2xl font-bold tracking-tight text-emerald-600 sm:text-3xl dark:text-emerald-400">
                        {formatCurrency(invoice.total_amount)}
                      </div>
                    </div>
                    <div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold",
                          isPaid
                            ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        )}
                      >
                        {isPaid ? (
                          <>
                            <CheckCircle2 className="size-3.5" /> Lunas /
                            Terverifikasi
                          </>
                        ) : (
                          <>
                            <Clock className="size-3.5" /> Menunggu Pembayaran
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Payment Details Grid */}
                  <div className="grid grid-cols-2 gap-2 border-t border-border/60 pt-2.5 text-xs sm:grid-cols-4">
                    <div className="space-y-0.5">
                      <span className="block text-[10px] text-muted-foreground">
                        Tanggal Terbit
                      </span>
                      <p className="font-medium text-foreground">
                        {formatDate(invoice.created_at)}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="block text-[10px] text-muted-foreground">
                        Jatuh Tempo
                      </span>
                      <p className="font-medium text-foreground">
                        {formatDate(invoice.due_date)}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="block text-[10px] text-muted-foreground">
                        Metode Pembayaran
                      </span>
                      <p className="truncate font-medium text-foreground">
                        {invoice.payment_method || "—"}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="block text-[10px] text-muted-foreground">
                        Status Pelunasan
                      </span>
                      <p
                        className={cn(
                          "truncate font-medium",
                          invoice.paid_at
                            ? "font-semibold text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground"
                        )}
                      >
                        {invoice.paid_at
                          ? formatDate(invoice.paid_at)
                          : "Belum lunas"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Client & License Info Cards */}
                <InvoiceDetailClientInfo
                  client={invoice.client}
                  license={invoice.license}
                />

                {/* Notes if present */}
                {invoice.notes && (
                  <div className="space-y-1 rounded-xl border border-border/80 bg-muted/20 p-3">
                    <span className="block text-xs font-semibold text-foreground">
                      Catatan Faktur:
                    </span>
                    <p className="text-xs whitespace-pre-wrap text-muted-foreground">
                      {invoice.notes}
                    </p>
                  </div>
                )}
              </div>
            </Scrollable>
          </TabsContent>

          {/* TAB 2: Item yang Diorder with dedicated Scrollable */}
          <TabsContent value="items" className="mt-0 min-h-0 flex-1">
            <Scrollable className="max-h-[50vh] pr-1.5 sm:max-h-[54vh]">
              <div className="space-y-3 pr-1 pb-1">
                <InvoiceDetailItemsTable
                  items={invoice.items}
                  totalAmount={invoice.total_amount}
                />
              </div>
            </Scrollable>
          </TabsContent>
        </Tabs>

        {/* Bottom Actions Footer (Fixed at the bottom of dialog) */}
        <div className="mt-2 flex shrink-0 items-center justify-end gap-2 border-t border-border pt-3">
          {!isPaid && onCancelClick && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 cursor-pointer gap-1.5 rounded-xl border-destructive/20 px-3.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
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
            size="sm"
            className="h-8 cursor-pointer gap-1.5 rounded-xl px-3.5 text-xs font-medium"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
          >
            {isDownloadingPdf ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
            <span>Unduh Invoice</span>
          </Button>

          {!isPaid && onMarkPaidClick && (
            <Button
              type="button"
              size="sm"
              className="h-8 cursor-pointer gap-1.5 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
              onClick={() => {
                onOpenChange(false)
                onMarkPaidClick(invoice)
              }}
            >
              <CheckCircle2 className="size-3.5" />
              <span>Tandai Lunas</span>
            </Button>
          )}
        </div>
      </div>
    </BaseDialog>
  )
}
