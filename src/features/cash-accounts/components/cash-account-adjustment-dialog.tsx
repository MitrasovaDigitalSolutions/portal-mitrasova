"use client"

import { useEffect, type JSX } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react"
import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import {
  FormDatePicker,
  FormNominalInput,
  FormTextarea,
} from "@/components/forms"
import { formatCurrency } from "@/utils"
import { useAdjustCashAccount } from "../api/cash-account.queries"
import {
  cashAdjustmentSchema,
  type CashAdjustmentFormValues,
} from "../validations/cash-account.schema"
import type { CashAdjustmentTarget } from "../hooks/use-cash-accounts-tab"

export interface CashAccountAdjustmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  target: CashAdjustmentTarget | null
}

const DEFAULT_VALUES: CashAdjustmentFormValues = {
  amount: 0,
  description: "",
  transaction_date: "",
}

export function CashAccountAdjustmentDialog({
  open,
  onOpenChange,
  target,
}: CashAccountAdjustmentDialogProps): JSX.Element {
  const isCredit = target?.direction === "credit"
  const adjustMutation = useAdjustCashAccount()
  const isPending = adjustMutation.isPending

  const methods = useForm<CashAdjustmentFormValues>({
    resolver: zodResolver(cashAdjustmentSchema),
    defaultValues: DEFAULT_VALUES,
  })
  const { handleSubmit, reset } = methods

  useEffect(() => {
    if (!open) {
      return
    }
    const today = new Date().toISOString().split("T")[0]
    reset({
      amount: 0,
      description: "",
      transaction_date: today,
    })
  }, [open, reset])

  const onSubmit = async (values: CashAdjustmentFormValues): Promise<void> => {
    if (!target) {
      return
    }
    try {
      await adjustMutation.mutateAsync({
        id: target.account.id,
        direction: target.direction,
        payload: {
          amount: values.amount,
          description: values.description.trim(),
          transaction_date: values.transaction_date || undefined,
        },
      })
      onOpenChange(false)
    } catch {
      // Error is caught and displayed by toast in query hook
    }
  }

  const account = target?.account
  const balance = account ? Number(account.current_balance) : 0

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-md"
      title={
        <div className="flex items-center gap-2.5">
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded-xl border ${
              isCredit
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            {isCredit ? (
              <ArrowDownLeft size={16} />
            ) : (
              <ArrowUpRight size={16} />
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">
              {isCredit
                ? "Kredit Kas (Pemasukan Manual)"
                : "Debit Kas (Pengeluaran Manual)"}
            </div>
            <p className="text-[11px] font-normal text-muted-foreground">
              {isCredit
                ? "Penyesuaian saldo masuk langsung ke akun kas."
                : "Penyesuaian saldo keluar dari akun kas."}
            </p>
          </div>
        </div>
      }
    >
      <div className="mb-4 rounded-xl border border-border bg-muted/40 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Akun Terpilih:</span>
          <span className="font-semibold text-foreground">{account?.name}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Saldo Saat Ini:</span>
          <span className="font-mono font-bold text-foreground">
            {formatCurrency(balance)}
          </span>
        </div>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-3.5"
        >
          <FormNominalInput<CashAdjustmentFormValues>
            name="amount"
            label="Nominal Penyesuaian"
            placeholder="0"
            required
          />

          <FormDatePicker<CashAdjustmentFormValues>
            name="transaction_date"
            label="Tanggal Transaksi"
            placeholder="Pilih tanggal..."
          />

          <FormTextarea<CashAdjustmentFormValues>
            name="description"
            label="Keterangan / Alasan Penyesuaian"
            placeholder="Contoh: Koreksi selisih saldo kas fisik, bonus bunga bank..."
            required
          />

          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="h-9 cursor-pointer rounded-xl px-4 text-xs font-semibold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={`h-9 cursor-pointer gap-2 rounded-xl px-4 text-xs font-semibold shadow-xs ${
                isCredit
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-rose-600 text-white hover:bg-rose-700"
              }`}
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              <span>{isCredit ? "Simpan Kredit (+)" : "Simpan Debit (-)"}</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
