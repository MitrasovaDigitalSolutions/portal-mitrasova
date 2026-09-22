"use client"

import * as React from "react"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Building,
  CheckCircle2,
  Clock,
  KeyRound,
  Loader2,
  Receipt,
} from "lucide-react"

import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import { FormDatePicker, FormSelect } from "@/components/forms"
import { formatCurrency, formatDate } from "@/utils"

import type { Invoice } from "../@types/invoice"
import { useMarkInvoiceAsPaid } from "../api/invoice.queries"
import {
  markPaidSchema,
  type MarkPaidFormValues,
} from "../validations/invoice.schema"

interface InvoiceMarkPaidDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
}

const PAYMENT_METHOD_OPTIONS = [
  { value: "Transfer Bank BCA", label: "Transfer Bank BCA" },
  { value: "Transfer Bank Mandiri", label: "Transfer Bank Mandiri" },
  { value: "Transfer Bank BNI", label: "Transfer Bank BNI" },
  { value: "Transfer Bank BRI", label: "Transfer Bank BRI" },
  { value: "QRIS", label: "QRIS" },
  { value: "Tunai", label: "Tunai" },
  { value: "Kartu Kredit", label: "Kartu Kredit" },
]

export function InvoiceMarkPaidDialog({
  open,
  onOpenChange,
  invoice,
}: InvoiceMarkPaidDialogProps): React.JSX.Element {
  const markPaidMutation = useMarkInvoiceAsPaid()

  const methods = useForm<MarkPaidFormValues>({
    resolver: zodResolver(markPaidSchema),
    defaultValues: {
      payment_method: "Transfer Bank BCA",
      paid_at: "",
    },
  })

  const { reset, handleSubmit, control } = methods
  const watchedPaymentMethod = useWatch({ control, name: "payment_method" })

  // Initialize form state when invoice opens
  React.useEffect(() => {
    if (open && invoice) {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const day = String(now.getDate()).padStart(2, "0")

      reset({
        payment_method: invoice.payment_method || "Transfer Bank BCA",
        paid_at: `${year}-${month}-${day}`,
      })
    }
  }, [open, invoice, reset])

  if (!invoice) {
    return <></>
  }

  const clientDisplayName =
    invoice.client?.nama_pemilik && invoice.client?.nama_usaha
      ? `${invoice.client.nama_pemilik} (${invoice.client.nama_usaha})`
      : invoice.client?.nama_pemilik || invoice.client?.nama_usaha || "—"

  const licenseDisplayName = invoice.license
    ? invoice.license.nama_instance ||
      invoice.license.domain_instance ||
      invoice.license.license_key ||
      "Lisensi Terkait"
    : invoice.items?.[0]?.name || "Tanpa Lisensi"

  const onSubmit = async (data: MarkPaidFormValues) => {
    await markPaidMutation.mutateAsync({
      id: invoice.id,
      payload: {
        payment_method: data.payment_method.trim(),
        paid_at: data.paid_at ? new Date(data.paid_at).toISOString() : undefined,
      },
    })

    onOpenChange(false)
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-lg"
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground leading-tight">
              Tandai Invoice Lunas
            </h3>
            <p className="text-[11px] font-normal text-muted-foreground">
              Konfirmasi pelunasan tagihan invoice
            </p>
          </div>
        </div>
      }
      headerRight={
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 border border-border/80 font-mono text-[11px] font-semibold text-foreground">
          <Receipt className="size-3 text-muted-foreground" />
          <span>{invoice.invoice_number}</span>
        </div>
      }
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 pt-1 text-xs">
          {/* Hero Receipt Card */}
          <div className="rounded-xl border border-border/80 bg-gradient-to-br from-emerald-500/5 via-card to-primary/5 p-3 sm:p-3.5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                  Total Tagihan
                </span>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {formatCurrency(invoice.total_amount)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  <Clock className="size-2.5" />
                  Jatuh tempo: {formatDate(invoice.due_date)}
                </span>
              </div>
            </div>

            {/* Context Info 2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2.5 border-t border-border/60">
              {/* Customer */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Building className="size-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-muted-foreground leading-none">Pelanggan</p>
                  <p className="font-medium text-foreground truncate mt-0.5" title={clientDisplayName}>
                    {clientDisplayName}
                  </p>
                </div>
              </div>

              {/* Linked License / Product */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <KeyRound className="size-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-muted-foreground leading-none">Lisensi / Produk</p>
                  <p className="font-medium text-foreground truncate mt-0.5" title={licenseDisplayName}>
                    {licenseDisplayName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields: 2 Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
            <FormSelect<MarkPaidFormValues>
              name="payment_method"
              label="Metode Pembayaran"
              options={PAYMENT_METHOD_OPTIONS}
              placeholder="Pilih metode pembayaran..."
              searchPlaceholder="Cari metode pembayaran..."
            />

            <FormDatePicker<MarkPaidFormValues>
              name="paid_at"
              label="Tanggal Pelunasan"
              placeholder="Pilih tanggal pelunasan..."
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={markPaidMutation.isPending}
              className="h-8 px-3.5 text-xs font-medium cursor-pointer rounded-xl"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 px-4 gap-1.5 text-xs font-semibold cursor-pointer rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              disabled={
                markPaidMutation.isPending || !watchedPaymentMethod?.trim()
              }
            >
              {markPaidMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="size-3.5" />
              )}
              <span>Konfirmasi Lunas</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}

