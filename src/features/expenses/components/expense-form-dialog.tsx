"use client"

import { useEffect, useMemo, useState, type JSX } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Receipt, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import {
  FormDatePicker,
  FormNominalInput,
  FormSelect,
  FormTextarea,
} from "@/components/forms"
import { useCashAccounts } from "@/features/cash-accounts/api/cash-account.queries"
import { useExpenseCategories } from "@/features/expense-categories/api/expense-category.queries"
import { formatCurrency } from "@/utils"
import { useCreateExpense } from "../api/expense.queries"
import {
  expenseSchema,
  type ExpenseFormValues,
} from "../validations/expense.schema"

export interface ExpenseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DEFAULT_VALUES: ExpenseFormValues = {
  cash_account_id: 0,
  expense_category_id: null,
  category: "",
  amount: 0,
  transaction_date: "",
  notes: "",
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export function ExpenseFormDialog({
  open,
  onOpenChange,
}: ExpenseFormDialogProps): JSX.Element {
  const [receiptFile, setReceiptFile] = useState<File | null>(null)

  const { data: accountsData, isLoading: isLoadingAccounts } = useCashAccounts({
    is_active: true,
  })
  const accounts = useMemo(() => accountsData?.data ?? [], [accountsData?.data])

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useExpenseCategories({ is_active: true })
  const categories = useMemo(
    () => categoriesData?.data ?? [],
    [categoriesData?.data]
  )

  const defaultAccount = useMemo(
    () => accounts.find((acc) => acc.is_default) ?? accounts[0] ?? null,
    [accounts]
  )

  const createMutation = useCreateExpense()
  const isPending = createMutation.isPending

  const methods = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: DEFAULT_VALUES,
  })
  const { handleSubmit, reset } = methods

  useEffect(() => {
    if (!open) {
      return
    }
    const today = new Date().toISOString().split("T")[0]
    reset({
      cash_account_id: defaultAccount?.id ?? 0,
      expense_category_id: categories[0]?.id ?? null,
      category: "",
      amount: 0,
      transaction_date: today,
      notes: "",
    })
    setReceiptFile(null)
  }, [open, defaultAccount, categories, reset])

  const accountOptions = useMemo(
    () =>
      accounts.map((acc) => ({
        value: String(acc.id),
        label: `${acc.name} (${formatCurrency(Number(acc.current_balance))})`,
      })),
    [accounts]
  )

  const categoryOptions = useMemo(
    () =>
      categories.map((cat) => ({
        value: String(cat.id),
        label: cat.name,
      })),
    [categories]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Ukuran file struk maksimal 5 MB")
      e.target.value = ""
      return
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format file harus berupa JPG, PNG, atau PDF")
      e.target.value = ""
      return
    }

    setReceiptFile(file)
  }

  const onSubmit = async (values: ExpenseFormValues): Promise<void> => {
    try {
      await createMutation.mutateAsync({
        cash_account_id: Number(values.cash_account_id),
        expense_category_id: values.expense_category_id
          ? Number(values.expense_category_id)
          : null,
        category: values.category ? values.category.trim() : null,
        amount: Number(values.amount),
        transaction_date: values.transaction_date || undefined,
        notes: values.notes ? values.notes.trim() : null,
        receipt: receiptFile,
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
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Receipt size={16} />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">
              Catat Pengeluaran Kas
            </div>
            <p className="text-[11px] font-normal text-muted-foreground">
              Dokumentasikan pengeluaran operasional, pembayaran beban, atau
              biaya rutin.
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
            <FormSelect<ExpenseFormValues>
              name="cash_account_id"
              label="Sumber Akun Kas"
              options={accountOptions}
              placeholder="Pilih akun kas..."
              isLoading={isLoadingAccounts}
              required
            />

            <FormSelect<ExpenseFormValues>
              name="expense_category_id"
              label="Kategori Pengeluaran"
              options={categoryOptions}
              placeholder="Pilih kategori..."
              isLoading={isLoadingCategories}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <FormNominalInput<ExpenseFormValues>
              name="amount"
              label="Nominal Pengeluaran"
              placeholder="0"
              required
            />

            <FormDatePicker<ExpenseFormValues>
              name="transaction_date"
              label="Tanggal Pengeluaran"
              placeholder="Pilih tanggal..."
            />
          </div>

          <FormTextarea<ExpenseFormValues>
            name="notes"
            label="Keterangan / Catatan"
            placeholder="Rincian peruntukan pengeluaran, nomor nota, atau vendor..."
            rows={2}
          />

          {/* Upload Receipt File Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Bukti / Struk Pembayaran (Opsional)
            </label>
            <div className="flex items-center gap-2">
              <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground shadow-2xs hover:bg-muted/50">
                <Upload size={13} className="text-muted-foreground" />
                <span>Pilih Berkas (JPG, PNG, PDF maks 5MB)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {receiptFile && (
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs">
                  <span className="max-w-[180px] truncate font-mono text-muted-foreground">
                    {receiptFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setReceiptFile(null)}
                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                    title="Hapus berkas"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
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
              className="h-9 cursor-pointer gap-2 rounded-xl bg-rose-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-rose-700"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              <span>Simpan Pengeluaran</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
