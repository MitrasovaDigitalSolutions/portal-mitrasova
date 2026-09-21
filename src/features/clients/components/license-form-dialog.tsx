"use client"

import { useEffect, useMemo } from "react"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaseDialog } from "@/components/ui/base-dialog"
import { FormDatePicker, FormInput, FormSelect } from "@/components/forms"
import type { AsyncQueryParams, AsyncQueryResult } from "@/components/forms/form-select"
import { useInfiniteProducts } from "@/features/products"
import type { Product } from "@/features/products"
import { useCreateLicense, useUpdateLicense } from "../api/license.queries"
import {
  licenseFormSchema,
  type LicenseFormValues,
} from "../validations/license.schema"
import { SUBSCRIPTION_TYPES, SERVER_TYPES, LICENSE_STATUSES } from "../constants"
import type { License } from "../@types/license"

export interface LicenseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  license: License | null
}

const defaultValues: LicenseFormValues = {
  client_id: "",
  product_id: "",
  nama_instance: "",
  domain_instance: "",
  subscription_type: "yearly",
  server_type: "cloud",
  status: "active",
  expires_at: undefined,
  grace_period_days: 7,
}

export function LicenseFormDialog({
  open,
  onOpenChange,
  clientId,
  license,
}: LicenseFormDialogProps): React.JSX.Element {
  const isEdit = Boolean(license)
  const createMutation = useCreateLicense()
  const updateMutation = useUpdateLicense()
  const isPending = createMutation.isPending || updateMutation.isPending

  // ─── Infinite products query adapter for async FormSelect ────────────────
  function useInfiniteProductsQuery(
    params: AsyncQueryParams
  ): AsyncQueryResult<Product> {
    return useInfiniteProducts({
      search: params.search,
      per_page: params.per_page ?? 8,
      status: "active",
    }) as AsyncQueryResult<Product>
  }

  function mapProductOption(p: Product) {
    return { value: p.id, label: `${p.nama} (${p.code})` }
  }

  const subscriptionOptions = useMemo(
    () =>
      Object.entries(SUBSCRIPTION_TYPES).map(([val, conf]) => ({
        value: val,
        label: conf.label,
      })),
    []
  )

  const serverOptions = useMemo(
    () =>
      Object.entries(SERVER_TYPES).map(([val, conf]) => ({
        value: val,
        label: conf.label,
      })),
    []
  )

  const statusOptions = useMemo(
    () =>
      Object.entries(LICENSE_STATUSES).map(([val, conf]) => ({
        value: val,
        label: conf.label,
      })),
    []
  )

  const methods = useForm<LicenseFormValues>({
    resolver: zodResolver(licenseFormSchema),
    defaultValues: { ...defaultValues, client_id: clientId },
  })

  const { handleSubmit, reset, control } = methods
  const watchedSubscriptionType = useWatch({ control, name: "subscription_type" })
  const isLifetime = watchedSubscriptionType === "lifetime"

  useEffect(() => {
    if (open) {
      if (license) {
        reset({
          client_id: license.client_id,
          product_id: license.product_id,
          nama_instance: license.nama_instance,
          domain_instance: license.domain_instance ?? "",
          subscription_type: license.subscription_type,
          server_type: license.server_type,
          status: license.status,
          expires_at: license.expires_at ?? undefined,
          grace_period_days: license.grace_period_days ?? 7,
        })
      } else {
        reset({ ...defaultValues, client_id: clientId })
      }
    }
  }, [open, license, clientId, reset])

  const onSubmit = async (values: LicenseFormValues) => {
    try {
      const payload = {
        ...values,
        expires_at: isLifetime ? null : values.expires_at || null,
      }
      if (isEdit && license) {
        await updateMutation.mutateAsync({
          id: license.id,
          payload,
        })
      } else {
        await createMutation.mutateAsync(payload)
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
            {isEdit ? "Edit Data Lisensi" : "Terbitkan Lisensi Baru"}
          </div>
          <p className="text-[11px] font-normal text-muted-foreground">
            {isEdit
              ? "Perbarui konfigurasi instance dan parameter lisensi."
              : "Konfigurasikan instance software baru untuk klien ini."}
          </p>
        </div>
      }
      className="max-w-lg"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect<LicenseFormValues, Product>
              name="product_id"
              label="Produk Software"
              placeholder="Cari & pilih produk software..."
              searchPlaceholder="Ketik nama atau kode produk..."
              emptyMessage="Produk tidak ditemukan."
              useAsyncQuery={useInfiniteProductsQuery}
              mapOption={mapProductOption}
            />
            <FormInput
              name="nama_instance"
              label="Nama Instance / Cabang"
              placeholder="Contoh: POS Cabang Utama"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              name="domain_instance"
              label="Domain / IP Instance"
              placeholder="Contoh: pos.mitrasova.com atau IP"
              required
            />
            <FormSelect
              name="server_type"
              label="Tipe Server Hosting"
              options={serverOptions}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              name="subscription_type"
              label="Paket Berlangganan"
              options={subscriptionOptions}
            />
            <FormSelect
              name="status"
              label="Status Lisensi"
              options={statusOptions}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!isLifetime ? (
              <FormDatePicker
                name="expires_at"
                label="Tanggal Kedaluwarsa"
                placeholder="Pilih tanggal kedaluwarsa..."
              />
            ) : (
              <div className="space-y-1.5 opacity-60">
                <label className="text-xs font-medium text-muted-foreground">
                  Tanggal Kedaluwarsa
                </label>
                <div className="h-9 px-3 rounded-lg border border-dashed border-border bg-muted/40 flex items-center text-xs text-muted-foreground">
                  Paket Lifetime (Tidak ada kedaluwarsa)
                </div>
              </div>
            )}
            <FormInput
              name="grace_period_days"
              type="number"
              label="Grace Period (Hari)"
              placeholder="7"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 cursor-pointer font-medium"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? "Simpan Perubahan" : "Terbitkan Lisensi"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
