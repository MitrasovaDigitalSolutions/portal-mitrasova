"use client"

import { useEffect, type JSX } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import {
  FormInput,
  FormNominalInput,
  FormSelect,
  FormSwitch,
} from "@/components/forms"
import {
  useCreateCashAccount,
  useUpdateCashAccount,
} from "../api/cash-account.queries"
import {
  CASH_ACCOUNT_TYPE_OPTIONS,
  DEFAULT_CASH_ACCOUNT_TYPE,
} from "../constants/cash-account-options"
import {
  cashAccountSchema,
  type CashAccountFormValues,
} from "../validations/cash-account.schema"
import {
  toCreateCashAccountPayload,
  toUpdateCashAccountPayload,
} from "../utils/cash-account-payload"
import type { CashAccount } from "../@types/cash-account"

export interface CashAccountFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: CashAccount | null
}

const DEFAULT_VALUES: CashAccountFormValues = {
  name: "",
  type: DEFAULT_CASH_ACCOUNT_TYPE,
  account_number: "",
  opening_balance: 0,
  is_default: false,
  is_active: true,
}

export function CashAccountFormDialog({
  open,
  onOpenChange,
  account,
}: CashAccountFormDialogProps): JSX.Element {
  const isEdit = Boolean(account)
  const createMutation = useCreateCashAccount()
  const updateMutation = useUpdateCashAccount()
  const isPending = createMutation.isPending || updateMutation.isPending

  const methods = useForm<CashAccountFormValues>({
    resolver: zodResolver(cashAccountSchema),
    defaultValues: DEFAULT_VALUES,
  })
  const { handleSubmit, reset } = methods

  useEffect(() => {
    if (!open) {
      return
    }
    reset(
      account
        ? {
            name: account.name,
            type: account.type,
            account_number: account.account_number ?? "",
            opening_balance: Number(account.opening_balance) || 0,
            is_default: account.is_default,
            is_active: account.is_active,
          }
        : DEFAULT_VALUES
    )
  }, [open, account, reset])

  const onSubmit = async (values: CashAccountFormValues): Promise<void> => {
    try {
      if (account) {
        await updateMutation.mutateAsync({
          id: account.id,
          payload: toUpdateCashAccountPayload(values),
        })
      } else {
        await createMutation.mutateAsync(toCreateCashAccountPayload(values))
      }
      onOpenChange(false)
    } catch {
      // Pesan error ditampilkan oleh toast pada mutation hook
    }
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-lg"
      title={
        <div>
          <div className="text-sm font-bold text-foreground">
            {isEdit ? "Edit Akun Kas" : "Tambah Akun Kas"}
          </div>
          <p className="text-[11px] font-normal text-muted-foreground">
            {isEdit
              ? "Perbarui informasi akun kas. Saldo awal tidak dapat diubah."
              : "Buat rekening bank, kas tunai, atau payment gateway baru."}
          </p>
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
            <FormInput<CashAccountFormValues>
              name="name"
              label="Nama Akun Kas"
              placeholder="Contoh: BCA Operasional"
              required
            />
            <FormSelect<CashAccountFormValues>
              name="type"
              label="Tipe Akun"
              options={CASH_ACCOUNT_TYPE_OPTIONS}
              placeholder="Pilih tipe akun..."
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <FormInput<CashAccountFormValues>
              name="account_number"
              label="Nomor Rekening"
              placeholder="Opsional"
            />
            {!isEdit && (
              <FormNominalInput<CashAccountFormValues>
                name="opening_balance"
                label="Saldo Awal"
                placeholder="0"
                required
              />
            )}
          </div>

          <div className="space-y-2.5">
            <FormSwitch<CashAccountFormValues>
              name="is_default"
              label="Jadikan Akun Default"
              description="Dipakai otomatis saat invoice dilunasi tanpa memilih akun kas."
            />
            <FormSwitch<CashAccountFormValues>
              name="is_active"
              label="Akun Aktif"
              description="Hanya akun aktif yang dapat menerima transaksi kas."
            />
          </div>

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
              className="h-9 cursor-pointer gap-2 rounded-xl px-4 text-xs font-semibold shadow-xs"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              <span>{isEdit ? "Simpan Perubahan" : "Tambah Akun Kas"}</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
