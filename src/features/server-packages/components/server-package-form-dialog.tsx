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
  FormSwitch,
  FormTextarea,
} from "@/components/forms"
import {
  useCreateServerPackage,
  useUpdateServerPackage,
} from "../api/server-package.queries"
import {
  serverPackageSchema,
  type ServerPackageFormValues,
} from "../validations/server-package.schema"
import type { ServerPackage } from "../@types/server-package"

export interface ServerPackageFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  serverPackage: ServerPackage | null
}

const defaultValues: ServerPackageFormValues = {
  code: "",
  nama: "",
  cpu: "",
  ram: "",
  storage: "",
  description: "",
  harga_bulanan: 0,
  harga_tahunan: 0,
  is_active: true,
}

export function ServerPackageFormDialog({
  open,
  onOpenChange,
  serverPackage,
}: ServerPackageFormDialogProps): JSX.Element {
  const isEdit = Boolean(serverPackage)
  const createMutation = useCreateServerPackage()
  const updateMutation = useUpdateServerPackage()
  const isPending = createMutation.isPending || updateMutation.isPending

  const methods = useForm<ServerPackageFormValues>({
    resolver: zodResolver(serverPackageSchema),
    defaultValues,
  })

  const { handleSubmit, reset } = methods

  useEffect(() => {
    if (open) {
      if (serverPackage) {
        reset({
          code: serverPackage.code,
          nama: serverPackage.nama,
          cpu: serverPackage.cpu ?? "",
          ram: serverPackage.ram ?? "",
          storage: serverPackage.storage ?? "",
          description: serverPackage.description ?? "",
          harga_bulanan: Number(serverPackage.harga_bulanan) || 0,
          harga_tahunan: Number(serverPackage.harga_tahunan) || 0,
          is_active: serverPackage.is_active,
        })
      } else {
        reset(defaultValues)
      }
    }
  }, [open, serverPackage, reset])

  const onSubmit = async (values: ServerPackageFormValues) => {
    try {
      if (isEdit && serverPackage) {
        await updateMutation.mutateAsync({
          id: serverPackage.id,
          payload: values,
        })
      } else {
        await createMutation.mutateAsync(values)
      }
      onOpenChange(false)
    } catch {
      // Error handled by mutation hook toast
    }
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div>
          <div className="text-sm font-bold text-foreground">
            {isEdit ? "Edit Paket Server" : "Tambah Paket Server"}
          </div>
          <p className="text-[11px] font-normal text-muted-foreground">
            {isEdit
              ? "Perbarui spesifikasi hardware dan biaya sewa hosting server."
              : "Definisikan paket server hosting baru untuk lisensi klien."}
          </p>
        </div>
      }
      className="sm:max-w-xl"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormInput
              name="code"
              label="Kode Paket Server"
              placeholder="Contoh: CLOUD-S, VPS-2C"
              required
              disabled={isEdit}
            />
            <FormInput
              name="nama"
              label="Nama Paket Server"
              placeholder="Contoh: Cloud Starter 2GB"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormInput
              name="cpu"
              label="Spesifikasi CPU"
              placeholder="Contoh: 1 vCPU"
            />
            <FormInput
              name="ram"
              label="Spesifikasi RAM"
              placeholder="Contoh: 2 GB RAM"
            />
            <FormInput
              name="storage"
              label="Kapasitas Storage"
              placeholder="Contoh: 25 GB NVMe"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormNominalInput
              name="harga_bulanan"
              label="Biaya Sewa Bulanan"
              placeholder="0"
              required
            />
            <FormNominalInput
              name="harga_tahunan"
              label="Biaya Sewa Tahunan"
              placeholder="0"
              required
            />
          </div>

          <FormTextarea
            name="description"
            label="Deskripsi / Catatan Tambahan"
            placeholder="Keterangan alokasi resource, data center, atau backup..."
            rows={2}
          />

          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <FormSwitch
              name="is_active"
              label="Status Paket Server Aktif"
              description="Paket server yang aktif dapat dipilih saat registrasi lisensi baru."
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="h-9 px-4 text-xs font-semibold cursor-pointer rounded-xl"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-9 px-4 gap-2 text-xs font-semibold cursor-pointer rounded-xl shadow-xs"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              <span>{isEdit ? "Simpan Perubahan" : "Tambah Paket Server"}</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
