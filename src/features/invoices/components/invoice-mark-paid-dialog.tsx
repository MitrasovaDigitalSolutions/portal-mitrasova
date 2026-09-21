"use client"

import * as React from "react"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import { FormDatePicker, FormSelect, FormSwitch } from "@/components/forms"
import { useMarkInvoiceAsPaid } from "../api/invoice.queries"
import {
  markPaidSchema,
  type MarkPaidFormValues,
} from "../validations/invoice.schema"
import { formatCurrency, formatDate } from "@/utils"
import type { Invoice } from "../@types/invoice"
import {
  CheckCircle2,
  Building,
  KeyRound,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

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

const EXTEND_MONTH_OPTIONS = [1, 3, 6, 12]

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
      extend_license: false,
      extend_months: 1,
    },
  })

  const { setValue, reset, handleSubmit, control } = methods
  const watchedExtendLicense = useWatch({ control, name: "extend_license" })
  const watchedExtendMonths = useWatch({ control, name: "extend_months" }) || 1
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
        extend_license: Boolean(invoice.license_id),
        extend_months: 1,
      })
    }
  }, [open, invoice, reset])

  if (!invoice) {
    return <></>
  }

  const hasLicense = Boolean(invoice.license_id && invoice.license)

  const onSubmit = async (data: MarkPaidFormValues) => {
    await markPaidMutation.mutateAsync({
      id: invoice.id,
      payload: {
        payment_method: data.payment_method.trim(),
        paid_at: data.paid_at ? new Date(data.paid_at).toISOString() : undefined,
        extend_license: hasLicense ? data.extend_license : false,
        extend_months: hasLicense && data.extend_license ? data.extend_months : undefined,
      },
    })

    onOpenChange(false)
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-md sm:max-w-lg"
      title={
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-500" />
          <span>Tandai Invoice Lunas</span>
        </div>
      }
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2 text-xs">
          {/* Invoice Summary Box */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Nomor Faktur</span>
              <span className="font-mono font-bold text-foreground">
                {invoice.invoice_number}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pelanggan</span>
              <span className="font-medium text-foreground flex items-center gap-1.5">
                <Building className="size-3.5 text-muted-foreground" />
                {invoice.client?.nama_pemilik || invoice.client?.nama_usaha || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Jatuh Tempo</span>
              <span className="text-foreground">{formatDate(invoice.due_date)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <span className="font-semibold text-foreground">Total Tagihan</span>
              <span className="font-bold text-sm font-mono text-emerald-600 dark:text-emerald-400">
                {formatCurrency(invoice.total_amount)}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <FormSelect<MarkPaidFormValues>
            name="payment_method"
            label="Metode Pembayaran"
            options={PAYMENT_METHOD_OPTIONS}
            placeholder="Pilih metode pembayaran..."
            searchPlaceholder="Cari metode pembayaran..."
          />

          {/* Paid At DatePicker */}
          <div className="space-y-1">
            <FormDatePicker<MarkPaidFormValues>
              name="paid_at"
              label="Tanggal Pelunasan"
              placeholder="Pilih tanggal pelunasan..."
            />
            <p className="text-[11px] text-muted-foreground">
              Tanggal saat dana tagihan berhasil diterima atau diverifikasi.
            </p>
          </div>

          {/* License Extension Option (if linked to a license) */}
          {hasLicense && (
            <div className="space-y-3">
              <FormSwitch
                name="extend_license"
                label="Perpanjang Masa Aktif Lisensi Otomatis"
                description={`Lisensi: ${
                  invoice.license?.nama_instance || invoice.license?.domain_instance || "Terkait"
                }`}
              />

              {watchedExtendLicense && (
                <div className="rounded-xl border border-border bg-muted/20 p-3.5 space-y-2 animate-in fade-in duration-200">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <KeyRound className="size-3.5 text-muted-foreground" />
                    Tambah Durasi Masa Aktif
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {EXTEND_MONTH_OPTIONS.map((months) => {
                      const isSelected = watchedExtendMonths === months
                      return (
                        <button
                          key={months}
                          type="button"
                          onClick={() =>
                            setValue("extend_months", months, { shouldValidate: true })
                          }
                          className={cn(
                            "py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer text-center",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                              : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border"
                          )}
                        >
                          {months} Bulan
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={markPaidMutation.isPending}
              className="cursor-pointer text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="cursor-pointer gap-1.5 text-xs font-medium"
              disabled={markPaidMutation.isPending || !watchedPaymentMethod?.trim()}
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
