"use client"

import { useEffect, useMemo, type JSX } from "react"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaseDialog } from "@/components/ui/base-dialog"
import {
  FormDatePicker,
  FormInput,
  FormNumberInput,
  FormSelect,
  FormTextarea,
} from "@/components/forms"
import { useProducts } from "@/features/products"
import { useServerPackages } from "@/features/server-packages"
import { useCreateLicense, useUpdateLicense } from "../api/license.queries"
import {
  licenseFormSchema,
  type LicenseFormValues,
} from "../validations/license.schema"
import {
  SUBSCRIPTION_TYPES,
  LICENSE_STATUSES,
} from "../constants"
import type { CreateLicensePayload, License, UpdateLicensePayload } from "../@types/license"

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
  subscription_type: "annual",
  server_package_id: "",
  server_notes: "",
  status: "active",
  expires_at: undefined,
  grace_period_days: 7,
  create_invoice: false,
  billing_period: "annual",
}

export function LicenseFormDialog({
  open,
  onOpenChange,
  clientId,
  license,
}: LicenseFormDialogProps): JSX.Element {
  const isEdit = Boolean(license)
  const createMutation = useCreateLicense()
  const updateMutation = useUpdateLicense()
  const isPending = createMutation.isPending || updateMutation.isPending

  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    status: "active",
  })
  const { data: serverPackagesData, isLoading: isLoadingServers } = useServerPackages({
    is_active: true,
  })

  const productOptions = useMemo(
    () =>
      (productsData?.data ?? []).map((p) => ({
        value: p.id,
        label: `${p.nama} (${p.code})`,
      })),
    [productsData?.data]
  )

  const serverOptions = useMemo(
    () =>
      (serverPackagesData?.data ?? []).map((s) => ({
        value: s.id,
        label: `${s.nama} (${s.code})`,
      })),
    [serverPackagesData?.data]
  )

  const subscriptionOptions = useMemo(
    () => [
      { value: "annual", label: SUBSCRIPTION_TYPES.annual.label },
      { value: "monthly", label: SUBSCRIPTION_TYPES.monthly.label },
      { value: "lifetime", label: SUBSCRIPTION_TYPES.lifetime.label },
      { value: "trial", label: SUBSCRIPTION_TYPES.trial.label },
    ],
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
          server_package_id: license.server_package_id ?? "",
          server_notes: license.server_notes ?? "",
          status: license.status,
          expires_at: license.expires_at ?? undefined,
          grace_period_days: license.grace_period_days ?? 7,
          create_invoice: false,
          billing_period: license.subscription_type === "monthly" ? "monthly" : "annual",
        })
      } else {
        reset({ ...defaultValues, client_id: clientId })
      }
    }
  }, [open, license, clientId, reset])

  const onSubmit = async (values: LicenseFormValues) => {
    try {
      if (isEdit && license) {
        const updatePayload: UpdateLicensePayload = {
          nama_instance: values.nama_instance,
          domain_instance: values.domain_instance || null,
          subscription_type: values.subscription_type,
          server_package_id: values.server_package_id,
          server_notes: values.server_notes || null,
          status: values.status,
          expires_at: isLifetime ? null : values.expires_at || null,
          grace_period_days: values.grace_period_days,
        }
        await updateMutation.mutateAsync({
          id: license.id,
          payload: updatePayload,
        })
      } else {
        const createPayload: CreateLicensePayload = {
          ...values,
          expires_at: isLifetime ? null : values.expires_at || null,
        }
        await createMutation.mutateAsync(createPayload)
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
            {isEdit ? "Edit Konfigurasi Lisensi" : "Terbitkan Lisensi Baru"}
          </div>
          <p className="text-[11px] font-normal text-muted-foreground">
            {isEdit
              ? "Perbarui konfigurasi instance, paket server, dan parameter lisensi."
              : "Konfigurasikan instance software baru untuk klien ini."}
          </p>
        </div>
      }
      className="sm:max-w-xl"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {!isEdit ? (
              <FormSelect
                name="product_id"
                label="Produk Software"
                placeholder="Pilih produk software..."
                searchPlaceholder="Ketik nama atau kode produk..."
                emptyMessage="Produk tidak ditemukan."
                options={productOptions}
                isLoading={isLoadingProducts}
              />
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Produk Software Terdaftar
                </label>
                <div className="flex h-9 items-center rounded-lg border border-border bg-muted/40 px-3 text-xs font-semibold text-foreground">
                  {license?.product?.nama || "Software Instance"}
                </div>
              </div>
            )}
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
            />
            <FormSelect
              name="server_package_id"
              label="Paket Server Hosting"
              placeholder="Pilih paket server..."
              options={serverOptions}
              isLoading={isLoadingServers}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormSelect
              name="subscription_type"
              label="Tipe Berlangganan"
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

          <FormTextarea
            name="server_notes"
            label="Catatan Server & Hosting"
            placeholder="Catatan tambahan mengenai server atau deployment..."
            rows={2}
          />

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
