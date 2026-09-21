"use client"

import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaseDialog } from "@/components/ui/base-dialog"
import { FormInput, FormTextarea } from "@/components/forms"
import { useCreateClient, useUpdateClient } from "../api/client.queries"
import {
  clientFormSchema,
  type ClientFormValues,
} from "../validations/client.schema"
import type { Client } from "../@types/client"

export interface ClientFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client | null
}

const defaultValues: ClientFormValues = {
  nama_pemilik: "",
  email: "",
  telepon: "",
  nama_perusahaan: "",
  alamat: "",
}

export function ClientFormDialog({
  open,
  onOpenChange,
  client,
}: ClientFormDialogProps): React.JSX.Element {
  const isEdit = Boolean(client)
  const createMutation = useCreateClient()
  const updateMutation = useUpdateClient()
  const isPending = createMutation.isPending || updateMutation.isPending

  const methods = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues,
  })

  const { handleSubmit, reset } = methods

  useEffect(() => {
    if (open) {
      if (client) {
        reset({
          nama_pemilik: client.nama_pemilik,
          email: client.email,
          telepon: client.telepon,
          nama_perusahaan: client.nama_perusahaan,
          alamat: client.alamat ?? "",
        })
      } else {
        reset(defaultValues)
      }
    }
  }, [open, client, reset])

  const onSubmit = async (values: ClientFormValues) => {
    try {
      if (isEdit && client) {
        await updateMutation.mutateAsync({
          id: client.id,
          payload: values,
        })
      } else {
        await createMutation.mutateAsync(values)
      }
      onOpenChange(false)
    } catch {
      // Toast already handled by mutation hooks
    }
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div>
          <div className="text-sm font-bold text-foreground">
            {isEdit ? "Edit Profil Klien" : "Tambah Klien Baru"}
          </div>
          <p className="text-[11px] font-normal text-muted-foreground">
            {isEdit
              ? "Perbarui informasi kontak dan instansi klien."
              : "Lengkapi formulir berikut untuk mendaftarkan klien baru."}
          </p>
        </div>
      }
      className="max-w-md"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              name="nama_pemilik"
              label="Nama Pemilik / Kontak"
              placeholder="Contoh: Budi Santoso"
              required
            />
            <FormInput
              name="email"
              type="email"
              label="Alamat Email"
              placeholder="budi@example.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              name="telepon"
              label="Nomor Telepon / WhatsApp"
              placeholder="08123456789"
              required
            />
            <FormInput
              name="nama_perusahaan"
              label="Nama Perusahaan / Instansi"
              placeholder="PT Maju Bersama"
              required
            />
          </div>

          <FormTextarea
            name="alamat"
            label="Alamat Lengkap"
            placeholder="Alamat kantor atau domisili usaha..."
            rows={2}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
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
              <span>{isEdit ? "Simpan Perubahan" : "Tambah Klien"}</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
