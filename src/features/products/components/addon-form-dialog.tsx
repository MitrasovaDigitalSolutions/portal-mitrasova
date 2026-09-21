"use client"

import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Layers, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaseDialog } from "@/components/ui/base-dialog"
import {
  FormInput,
  FormTextarea,
  FormNominalInput,
  FormSwitch,
} from "@/components/forms"
import {
  useCreateProductAddon,
  useUpdateProductAddon,
} from "../api/product.queries"
import {
  addonSchema,
  type AddonFormValues,
} from "../validations/addon.schema"
import type { ProductAddon } from "../@types/product"

export interface AddonFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  productName: string
  addon: ProductAddon | null
}

const defaultValues: AddonFormValues = {
  code: "",
  nama: "",
  description: "",
  harga_bulanan: 0,
  harga_tahunan: 0,
  is_active: true,
}

export function AddonFormDialog({
  open,
  onOpenChange,
  productId,
  productName,
  addon,
}: AddonFormDialogProps): React.JSX.Element {
  const isEdit = Boolean(addon)
  const createMutation = useCreateProductAddon(productId)
  const updateMutation = useUpdateProductAddon(productId)
  const isPending = createMutation.isPending || updateMutation.isPending

  const methods = useForm<AddonFormValues>({
    resolver: zodResolver(addonSchema),
    defaultValues,
  })

  const { handleSubmit, reset } = methods

  useEffect(() => {
    if (open) {
      if (addon) {
        reset({
          code: addon.code,
          nama: addon.nama,
          description: addon.description ?? "",
          harga_bulanan: Number(addon.harga_bulanan) || 0,
          harga_tahunan: Number(addon.harga_tahunan) || 0,
          is_active: addon.is_active,
        })
      } else {
        reset(defaultValues)
      }
    }
  }, [open, addon, reset])

  const onSubmit = async (values: AddonFormValues) => {
    try {
      if (isEdit && addon) {
        await updateMutation.mutateAsync({
          addonId: addon.id,
          payload: {
            code: values.code.trim().toUpperCase(),
            nama: values.nama.trim(),
            description: values.description?.trim() || null,
            harga_bulanan: values.harga_bulanan,
            harga_tahunan: values.harga_tahunan,
            is_active: values.is_active,
          },
        })
      } else {
        await createMutation.mutateAsync({
          code: values.code.trim().toUpperCase(),
          nama: values.nama.trim(),
          description: values.description?.trim() || null,
          harga_bulanan: values.harga_bulanan,
          harga_tahunan: values.harga_tahunan,
          is_active: values.is_active,
        })
      }
      onOpenChange(false)
    } catch {
      // Handled by toast in mutation
    }
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-lg"
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Layers className="size-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">
              {isEdit ? "Edit Modul Addon" : "Tambah Modul Addon"}
            </div>
            <p className="text-[11px] font-normal text-muted-foreground">
              Produk induk: <span className="font-semibold text-foreground">{productName}</span>
            </p>
          </div>
        </div>
      }
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormInput<AddonFormValues>
              name="code"
              label="Kode Addon"
              placeholder="Contoh: ADDON-WA"
              required
              className="font-mono uppercase placeholder:normal-case"
            />
            <FormInput<AddonFormValues>
              name="nama"
              label="Nama Addon"
              placeholder="Contoh: WhatsApp Gateway"
              required
            />
          </div>

          <FormTextarea<AddonFormValues>
            name="description"
            label="Deskripsi (Opsional)"
            placeholder="Keterangan fungsi atau limitasi dari modul addon..."
            rows={2}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormNominalInput<AddonFormValues>
              name="harga_bulanan"
              label="Harga Bulanan (Rp)"
              placeholder="0"
            />
            <FormNominalInput<AddonFormValues>
              name="harga_tahunan"
              label="Harga Tahunan (Rp)"
              placeholder="0"
            />
          </div>

          <FormSwitch<AddonFormValues>
            name="is_active"
            label="Status Addon Aktif"
            description="Addon aktif dapat dipilih untuk aktivasi pada lisensi"
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="gap-2 bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500"
            >
              {isPending && <Loader2 className="size-3.5 animate-spin" />}
              {isEdit ? "Simpan Perubahan" : "Tambah Addon"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
