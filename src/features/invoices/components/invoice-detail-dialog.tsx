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
      className="sm:max-w-xl md:max-w-2xl max-h-[90vh] flex flex-col"
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <FileText className="size-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-sm tracking-tight text-foreground">
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
        </div>
      }
      headerRight={<InvoiceStatusBadge status={invoice.status} />}
    >
      <div className="flex flex-col flex-1 min-h-0 pt-1 text-xs">
        {/* Tabs: Tab 1 = Rincian & Biaya, Tab 2 = Item yang Diorder */}
        <Tabs defaultValue="overview" className="flex flex-col flex-1 min-h-0 w-full">
          <div className="shrink-0 pb-1.5">
            <TabsList className="grid grid-cols-2 w-full h-8.5 p-1 bg-muted/60 border border-border/80 rounded-xl">
              <TabsTrigger value="overview" className="gap-1.5 text-xs">
                <Receipt className="size-3.5" />
                <span>Rincian & Total Biaya</span>
              </TabsTrigger>
              <TabsTrigger value="items" className="gap-1.5 text-xs">
                <ShoppingCart className="size-3.5" />
                <span>Item yang Diorder</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-background font-medium border border-border/60">
                  {itemCount}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: Rincian & Total Biaya with dedicated Scrollable */}
          <TabsContent value="overview" className="flex-1 min-h-0 mt-0">
            <Scrollable className="max-h-[50vh] sm:max-h-[54vh] pr-1.5">
              <div className="space-y-3 pr-1 pb-1">
                {/* Hero Total Card */}
                <div className="rounded-xl border border-border/80 bg-gradient-to-br from-emerald-500/5 via-card to-primary/5 p-3.5 space-y-3 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                        Total Biaya Tagihan
                      </span>
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
                        {formatCurrency(invoice.total_amount)}
                      </div>
                    </div>
                    <div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border",
                          isPaid
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25"
                        )}
                      >
                        {isPaid ? (
                          <>
                            <CheckCircle2 className="size-3.5" /> Lunas / Terverifikasi
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-border/60 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Tanggal Terbit</span>
                      <p className="font-medium text-foreground">{formatDate(invoice.created_at)}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Jatuh Tempo</span>
                      <p className="font-medium text-foreground">{formatDate(invoice.due_date)}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Metode Pembayaran</span>
                      <p className="font-medium text-foreground truncate">
                        {invoice.payment_method || "—"}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block">Status Pelunasan</span>
                      <p
                        className={cn(
                          "font-medium truncate",
                          invoice.paid_at
                            ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                            : "text-muted-foreground"
                        )}
                      >
                        {invoice.paid_at ? formatDate(invoice.paid_at) : "Belum lunas"}
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
                  <div className="rounded-xl border border-border/80 bg-muted/20 p-3 space-y-1">
                    <span className="font-semibold text-foreground text-xs block">
                      Catatan Faktur:
                    </span>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {invoice.notes}
                    </p>
                  </div>
                )}
              </div>
            </Scrollable>
          </TabsContent>

          {/* TAB 2: Item yang Diorder with dedicated Scrollable */}
          <TabsContent value="items" className="flex-1 min-h-0 mt-0">
            <Scrollable className="max-h-[50vh] sm:max-h-[54vh] pr-1.5">
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
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border shrink-0 mt-2">
          {!isPaid && onCancelClick && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-3.5 gap-1.5 text-xs font-semibold cursor-pointer rounded-xl text-destructive hover:bg-destructive/10 border-destructive/20"
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
            className="h-8 px-3.5 gap-1.5 text-xs font-medium cursor-pointer rounded-xl"
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
              className="h-8 px-4 gap-1.5 text-xs font-semibold cursor-pointer rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
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

