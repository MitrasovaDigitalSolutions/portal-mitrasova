"use client"

import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Package, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaseDialog } from "@/components/ui/base-dialog"
import { FormInput, FormTextarea, FormSwitch } from "@/components/forms"
import { useCreateProduct, useUpdateProduct } from "../api/product.queries"
import { productSchema, type ProductFormValues } from "../validations/product.schema"
import type { Product } from "../@types/product"

export interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

const defaultValues: ProductFormValues = {
  code: "",
  nama: "",
  description: "",
  is_active: true,
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
}: ProductFormDialogProps): React.JSX.Element {
  const isEdit = Boolean(product)
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const isPending = createMutation.isPending || updateMutation.isPending

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  const { handleSubmit, reset } = methods

  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          code: product.code,
          nama: product.nama,
          description: product.description ?? "",
          is_active: product.is_active,
        })
      } else {
        reset(defaultValues)
      }
    }
  }, [open, product, reset])

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (isEdit && product) {
        await updateMutation.mutateAsync({
          id: product.id,
          payload: {
            code: values.code.trim().toUpperCase(),
            nama: values.nama.trim(),
            description: values.description?.trim() || null,
            is_active: values.is_active,
          },
        })
      } else {
        await createMutation.mutateAsync({
          code: values.code.trim().toUpperCase(),
          nama: values.nama.trim(),
          description: values.description?.trim() || null,
          is_active: values.is_active,
        })
      }
      onOpenChange(false)
    } catch {
      // Error handled by query mutation toast
    }
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-lg"
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="size-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">
              {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
            </div>
            <p className="text-[11px] font-normal text-muted-foreground">
              {isEdit
                ? `Perbarui informasi dan status produk ${product?.nama}`
                : "Daftarkan produk software atau modul sistem baru"}
            </p>
          </div>
        </div>
      }
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <FormInput<ProductFormValues>
            name="code"
            label="Kode Produk"
            placeholder="Contoh: MITRA-POS"
            required
            className="font-mono uppercase placeholder:normal-case"
          />

          <FormInput<ProductFormValues>
            name="nama"
            label="Nama Produk"
            placeholder="Contoh: Mitrasova Point of Sale"
            required
          />

          <FormTextarea<ProductFormValues>
            name="description"
            label="Deskripsi (Opsional)"
            placeholder="Jelaskan cakupan fitur atau kegunaan sistem ini..."
            rows={3}
          />

          <FormSwitch<ProductFormValues>
            name="is_active"
            label="Produk Aktif"
            description="Produk aktif dapat dihubungkan ke lisensi klien baru"
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 text-xs font-semibold cursor-pointer rounded-xl"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-9 px-4 gap-2 text-xs font-semibold cursor-pointer rounded-xl shadow-xs"
            >
              {isPending && <Loader2 className="size-3.5 animate-spin" />}
              <span>{isEdit ? "Simpan Perubahan" : "Buat Produk"}</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
