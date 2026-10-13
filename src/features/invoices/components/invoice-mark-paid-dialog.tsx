"use client"

import * as React from "react"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  KeyRound,
  Landmark,
  Loader2,
  Receipt,
} from "lucide-react"

import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import { FormDatePicker, FormNumberInput, FormSelect } from "@/components/forms"
import { useCashAccounts } from "@/features/cash-accounts/api/cash-account.queries"
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

  const { data: accountsData, isLoading: isLoadingAccounts } = useCashAccounts({
    is_active: true,
  })
  const accounts = React.useMemo(
    () => accountsData?.data ?? [],
    [accountsData?.data]
  )

  const defaultAccount = React.useMemo(
    () => accounts.find((acc) => acc.is_default) ?? accounts[0] ?? null,
    [accounts]
  )

  const accountOptions = React.useMemo(
    () =>
      accounts.map((acc) => ({
        value: String(acc.id),
        label: `${acc.name} (${formatCurrency(Number(acc.current_balance))})`,
      })),
    [accounts]
  )

  const methods = useForm<MarkPaidFormValues>({
    resolver: zodResolver(markPaidSchema),
    defaultValues: {
      payment_method: "Transfer Bank BCA",
      paid_at: "",
      extend_months: null,
      cash_account_id: null,
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
        extend_months: null,
        cash_account_id: defaultAccount ? defaultAccount.id : null,
      })
    }
  }, [open, invoice, defaultAccount, reset])

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
        paid_at: data.paid_at
          ? new Date(data.paid_at).toISOString()
          : undefined,
        extend_months: data.extend_months
          ? Number(data.extend_months)
          : undefined,
        cash_account_id: data.cash_account_id
          ? Number(data.cash_account_id)
          : undefined,
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
          <div className="flex size-7 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4" />
          </div>
          <div>
            <h3 className="text-sm leading-tight font-semibold text-foreground">
              Tandai Invoice Lunas
            </h3>
            <p className="text-[11px] font-normal text-muted-foreground">
              Konfirmasi pelunasan tagihan & mutasi kas masuk
            </p>
          </div>
        </div>
      }
      headerRight={
        <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-foreground">
          <Receipt className="size-3 text-muted-foreground" />
          <span>{invoice.invoice_number}</span>
        </div>
      }
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-3.5 pt-1 text-xs"
        >
          {/* Hero Receipt Card */}
          <div className="space-y-3 rounded-xl border border-border/80 bg-gradient-to-br from-emerald-500/5 via-card to-primary/5 p-3 shadow-2xs sm:p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Total Tagihan
                </span>
                <div className="font-mono text-xl font-bold tracking-tight text-emerald-600 sm:text-2xl dark:text-emerald-400">
                  {formatCurrency(invoice.total_amount)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                  <Clock className="size-2.5" />
                  Jatuh tempo: {formatDate(invoice.due_date)}
                </span>
              </div>
            </div>

            {/* Context Info 2 Grid */}
            <div className="grid grid-cols-1 gap-2 border-t border-border/60 pt-2.5 sm:grid-cols-2">
              {/* Customer */}
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Building className="size-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] leading-none text-muted-foreground">
                    Pelanggan
                  </p>
                  <p
                    className="mt-0.5 truncate font-medium text-foreground"
                    title={clientDisplayName}
                  >
                    {clientDisplayName}
                  </p>
                </div>
              </div>

              {/* Linked License / Product */}
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <KeyRound className="size-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] leading-none text-muted-foreground">
                    Lisensi / Produk
                  </p>
                  <p
                    className="mt-0.5 truncate font-medium text-foreground"
                    title={licenseDisplayName}
                  >
                    {licenseDisplayName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields: 2 Grid Layout */}
          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
            <FormSelect<MarkPaidFormValues>
              name="payment_method"
              label="Metode Pembayaran"
              options={PAYMENT_METHOD_OPTIONS}
              placeholder="Pilih metode pembayaran..."
              searchPlaceholder="Cari metode pembayaran..."
              required
            />

            <FormDatePicker<MarkPaidFormValues>
              name="paid_at"
              label="Tanggal Pelunasan"
              placeholder="Pilih tanggal pelunasan..."
            />
          </div>

          {/* Cash Account Selection */}
          <div className="space-y-1.5">
            <FormSelect<MarkPaidFormValues>
              name="cash_account_id"
              label="Rekening / Akun Kas Masuk"
              options={accountOptions}
              placeholder={
                isLoadingAccounts
                  ? "Memuat daftar akun kas..."
                  : "Pilih akun kas penerima..."
              }
              searchPlaceholder="Cari nama akun atau bank..."
              leftIcon={
                <Landmark size={14} className="text-muted-foreground" />
              }
            />
            {accounts.length === 0 && !isLoadingAccounts ? (
              <p className="flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400">
                <AlertTriangle size={12} />
                <span>
                  Belum ada akun kas aktif. Buat akun kas di menu Akun Kas agar
                  pembayaran tercatat di buku kas.
                </span>
              </p>
            ) : (
              <p className="text-[10px] text-muted-foreground">
                Uang masuk sebesar{" "}
                <strong className="text-foreground">
                  {formatCurrency(invoice.total_amount)}
                </strong>{" "}
                akan otomatis menambah saldo akun kas terpilih.
              </p>
            )}
          </div>

          {/* Optional License Extend Duration */}
          {invoice.license && (
            <FormNumberInput<MarkPaidFormValues>
              name="extend_months"
              label="Perpanjang Masa Aktif Lisensi (Bulan)"
              placeholder="Otomatis mengikuti item invoice (opsional)"
              helperText="Kosongkan jika ingin mengikuti masa aktif sesuai paket item tagihan."
            />
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={markPaidMutation.isPending}
              className="h-8 cursor-pointer rounded-xl px-3.5 text-xs font-medium"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 cursor-pointer gap-1.5 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
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
