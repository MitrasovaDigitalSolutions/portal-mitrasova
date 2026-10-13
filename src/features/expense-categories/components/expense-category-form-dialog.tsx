"use client"

import { useEffect, type JSX } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import { FormInput, FormSwitch, FormTextarea } from "@/components/forms"
import {
  useCreateExpenseCategory,
  useUpdateExpenseCategory,
} from "../api/expense-category.queries"
import {
  expenseCategorySchema,
  type ExpenseCategoryFormValues,
} from "../validations/expense-category.schema"
import type { ExpenseCategory } from "../@types/expense-category"

export interface ExpenseCategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: ExpenseCategory | null
}

const DEFAULT_VALUES: ExpenseCategoryFormValues = {
  name: "",
  code: "",
  description: "",
  is_active: true,
}

export function ExpenseCategoryFormDialog({
  open,
  onOpenChange,
  category,
}: ExpenseCategoryFormDialogProps): JSX.Element {
  const isEdit = Boolean(category)
  const createMutation = useCreateExpenseCategory()
  const updateMutation = useUpdateExpenseCategory()
  const isPending = createMutation.isPending || updateMutation.isPending

  const methods = useForm<ExpenseCategoryFormValues>({
    resolver: zodResolver(expenseCategorySchema),
    defaultValues: DEFAULT_VALUES,
  })
  const { handleSubmit, reset } = methods

  useEffect(() => {
    if (!open) {
      return
    }
    reset(
      category
        ? {
            name: category.name,
            code: category.code,
            description: category.description ?? "",
            is_active: category.is_active,
          }
        : DEFAULT_VALUES
    )
  }, [open, category, reset])

  const onSubmit = async (values: ExpenseCategoryFormValues): Promise<void> => {
    try {
      if (category) {
        await updateMutation.mutateAsync({
          id: category.id,
          payload: {
            name: values.name.trim(),
            code: values.code ? values.code.trim() : null,
            description: values.description ? values.description.trim() : null,
            is_active: values.is_active,
          },
        })
      } else {
        await createMutation.mutateAsync({
          name: values.name.trim(),
          code: values.code ? values.code.trim() : null,
          description: values.description ? values.description.trim() : null,
          is_active: values.is_active,
        })
      }
      onOpenChange(false)
    } catch {
      // Handled by query toast
    }
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-md"
      title={
        <div>
          <div className="text-sm font-bold text-foreground">
            {isEdit
              ? "Edit Kategori Pengeluaran"
              : "Tambah Kategori Pengeluaran"}
          </div>
          <p className="text-[11px] font-normal text-muted-foreground">
            {isEdit
              ? "Perbarui nama atau keterangan kategori."
              : "Definisikan pos klasifikasi biaya baru."}
          </p>
        </div>
      }
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput<ExpenseCategoryFormValues>
            name="name"
            label="Nama Kategori"
            placeholder="Contoh: Operasional Kantor, Sewa Server, Gaji"
            required
          />

          <FormInput<ExpenseCategoryFormValues>
            name="code"
            label="Kode Kategori (Opsional)"
            placeholder="Contoh: OPS, SRV (otomatis dibuat jika kosong)"
          />

          <FormTextarea<ExpenseCategoryFormValues>
            name="description"
            label="Deskripsi / Catatan Tambahan"
            placeholder="Keterangan peruntukan kategori pengeluaran ini..."
            rows={2}
          />

          <FormSwitch<ExpenseCategoryFormValues>
            name="is_active"
            label="Kategori Aktif"
            description="Kategori aktif dapat dipilih saat mencatat pengeluaran kas."
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
              className="h-9 cursor-pointer gap-2 rounded-xl px-4 text-xs font-semibold shadow-xs"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              <span>{isEdit ? "Simpan Perubahan" : "Tambah Kategori"}</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
