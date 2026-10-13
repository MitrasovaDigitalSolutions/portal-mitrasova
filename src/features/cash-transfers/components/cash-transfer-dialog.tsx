"use client"

import { useEffect, useMemo, type JSX } from "react"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftRight, Loader2 } from "lucide-react"
import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import {
  FormDatePicker,
  FormNominalInput,
  FormSelect,
  FormTextarea,
} from "@/components/forms"
import { useCashAccounts } from "@/features/cash-accounts/api/cash-account.queries"
import { formatCurrency } from "@/utils"
import { useCreateCashTransfer } from "../api/cash-transfer.queries"
import {
  cashTransferSchema,
  type CashTransferFormValues,
} from "../validations/cash-transfer.schema"
import type { CashAccount } from "@/features/cash-accounts/@types/cash-account"

export interface CashTransferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultFromAccount?: CashAccount | null
}

export function CashTransferDialog({
  open,
  onOpenChange,
  defaultFromAccount,
}: CashTransferDialogProps): JSX.Element {
  const { data: accountsData, isLoading: isLoadingAccounts } = useCashAccounts({
    is_active: true,
  })
  const accounts = useMemo(() => accountsData?.data ?? [], [accountsData?.data])

  const createMutation = useCreateCashTransfer()
  const isPending = createMutation.isPending

  const methods = useForm<CashTransferFormValues>({
    resolver: zodResolver(cashTransferSchema),
    defaultValues: {
      from_cash_account_id: defaultFromAccount?.id ?? 0,
      to_cash_account_id: 0,
      amount: 0,
      admin_fee: 0,
      transfer_date: "",
      notes: "",
    },
  })

  const { handleSubmit, reset, control } = methods

  useEffect(() => {
    if (!open) {
      return
    }
    const today = new Date().toISOString().split("T")[0]
    reset({
      from_cash_account_id: defaultFromAccount?.id ?? (accounts[0]?.id || 0),
      to_cash_account_id: 0,
      amount: 0,
      admin_fee: 0,
      transfer_date: today,
      notes: "",
    })
  }, [open, defaultFromAccount, accounts, reset])

  const watchedFromId = useWatch({ control, name: "from_cash_account_id" })
  const watchedToId = useWatch({ control, name: "to_cash_account_id" })
  const watchedAmount = useWatch({ control, name: "amount" }) || 0
  const watchedAdminFee = useWatch({ control, name: "admin_fee" }) || 0

  const fromAccount = useMemo(
    () => accounts.find((acc) => acc.id === Number(watchedFromId)),
    [accounts, watchedFromId]
  )
  const toAccount = useMemo(
    () => accounts.find((acc) => acc.id === Number(watchedToId)),
    [accounts, watchedToId]
  )

  const accountOptions = useMemo(
    () =>
      accounts.map((acc) => ({
        value: String(acc.id),
        label: `${acc.name} (${formatCurrency(Number(acc.current_balance))})`,
      })),
    [accounts]
  )

  const totalDeduction = Number(watchedAmount) + Number(watchedAdminFee)
  const currentFromBalance = fromAccount
    ? Number(fromAccount.current_balance)
    : 0
  const isInsufficient = fromAccount
    ? currentFromBalance < totalDeduction
    : false

  const onSubmit = async (values: CashTransferFormValues): Promise<void> => {
    try {
      await createMutation.mutateAsync({
        from_cash_account_id: Number(values.from_cash_account_id),
        to_cash_account_id: Number(values.to_cash_account_id),
        amount: Number(values.amount),
        admin_fee: Number(values.admin_fee) || 0,
        transfer_date: values.transfer_date || undefined,
        notes: values.notes ? values.notes.trim() : null,
      })
      onOpenChange(false)
    } catch {
      // Error handled by query hook toast
    }
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-lg"
      title={
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <ArrowLeftRight size={16} />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">
              Transfer Antar Rekening Kas
            </div>
            <p className="text-[11px] font-normal text-muted-foreground">
              Pindahkan dana dari satu akun kas ke akun kas lainnya.
            </p>
          </div>
        </div>
      }
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <FormSelect<CashTransferFormValues>
              name="from_cash_account_id"
              label="Dari Akun Asal"
              options={accountOptions}
              placeholder="Pilih akun asal..."
              isLoading={isLoadingAccounts}
              required
            />

            <FormSelect<CashTransferFormValues>
              name="to_cash_account_id"
              label="Ke Akun Tujuan"
              options={accountOptions}
              placeholder="Pilih akun tujuan..."
              isLoading={isLoadingAccounts}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <FormNominalInput<CashTransferFormValues>
              name="amount"
              label="Nominal Transfer"
              placeholder="0"
              required
            />

            <FormNominalInput<CashTransferFormValues>
              name="admin_fee"
              label="Biaya Admin (Opsional)"
              placeholder="0"
            />
          </div>

          <FormDatePicker<CashTransferFormValues>
            name="transfer_date"
            label="Tanggal Transfer"
            placeholder="Pilih tanggal..."
          />

          <FormTextarea<CashTransferFormValues>
            name="notes"
            label="Catatan Transfer"
            placeholder="Keterangan keperluan transfer (opsional)..."
            rows={2}
          />

          {/* Transfer Summary Preview */}
          {fromAccount && toAccount && (
            <div
              className={`space-y-2 rounded-xl border p-3.5 text-xs transition-colors ${
                isInsufficient
                  ? "border-destructive/30 bg-destructive/5 text-destructive"
                  : "border-border bg-muted/30"
              }`}
            >
              <div className="font-semibold text-foreground">
                Ringkasan Mutasi:
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Total dipotong dari {fromAccount.name}:
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {formatCurrency(totalDeduction)}
                    {watchedAdminFee > 0 && (
                      <span className="text-[10px] font-normal text-muted-foreground">
                        {" "}
                        (termasuk biaya admin {formatCurrency(watchedAdminFee)})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Saldo {fromAccount.name} saat ini:
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {formatCurrency(currentFromBalance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Perkiraan sisa saldo {fromAccount.name}:
                  </span>
                  <span
                    className={`font-mono font-bold ${
                      isInsufficient ? "text-destructive" : "text-foreground"
                    }`}
                  >
                    {formatCurrency(currentFromBalance - totalDeduction)}
                  </span>
                </div>
              </div>

              {isInsufficient && (
                <p className="text-[11px] font-medium text-destructive">
                  Saldo akun asal tidak mencukupi untuk melakukan transfer ini.
                </p>
              )}
            </div>
          )}

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
              disabled={isPending || isInsufficient}
              className="h-9 cursor-pointer gap-2 rounded-xl px-4 text-xs font-semibold shadow-xs"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              <span>Proses Transfer</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
