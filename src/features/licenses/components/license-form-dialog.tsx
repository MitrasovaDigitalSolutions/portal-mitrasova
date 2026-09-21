"use client"

import { useEffect, useMemo } from "react"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaseDialog } from "@/components/ui/base-dialog"
import {
  FormDatePicker,
  FormInput,
  FormNumberInput,
  FormSelect,
} from "@/components/forms"
import { useProducts } from "@/features/products"
import { useCreateLicense, useUpdateLicense } from "../api/license.queries"
import {
  licenseFormSchema,
  type LicenseFormValues,
} from "../validations/license.schema"
import {
  SUBSCRIPTION_TYPES,
  SERVER_TYPES,
  LICENSE_STATUSES,
} from "../constants"
import type { CreateLicensePayload, License } from "../@types/license"

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

  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    status: "active",
  })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const products = productsData?.data ?? []

  const productOptions = useMemo(
    () =>
      products.map((p) => ({
        value: p.id,
        label: `${p.nama} (${p.code})`,
      })),
    [products]
  )

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
  const watchedSubscriptionType = useWatch({
    control,
    name: "subscription_type",
  })
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
      const isAnnual = values.subscription_type !== "monthly"
      const payload: CreateLicensePayload = {
        ...values,
        expires_at: isLifetime ? null : values.expires_at || null,
        create_invoice: true,
        billing_period: isAnnual ? "annual" : "monthly",
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
      className="sm:max-w-2xl"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormSelect
              name="product_id"
              label="Produk Software"
              placeholder="Pilih produk software..."
              searchPlaceholder="Ketik nama atau kode produk..."
              emptyMessage="Produk tidak ditemukan."
              options={productOptions}
              isLoading={isLoadingProducts}
            />
            <FormInput
              name="nama_instance"
              label="Nama Instance / Cabang"
              placeholder="Contoh: POS Cabang Utama"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <div className="flex h-9 items-center rounded-lg border border-dashed border-border bg-muted/40 px-3 text-xs text-muted-foreground">
                  Paket Lifetime (Tidak ada kedaluwarsa)
                </div>
              </div>
            )}
            <FormNumberInput
              name="grace_period_days"
              label="Grace Period (Hari)"
              placeholder="7"
              min={0}
              max={90}
              allowNegative={false}
              allowDecimal={false}
            />
          </div>

          {!isEdit && (
            <div className="flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
              <FileText className="size-4 shrink-0 text-primary" />
              <span>
                Faktur tagihan / invoice awal akan otomatis diterbitkan oleh sistem untuk pesanan lisensi ini.
              </span>
            </div>
          )}

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
              <span>{isEdit ? "Simpan Perubahan" : "Terbitkan Lisensi"}</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
