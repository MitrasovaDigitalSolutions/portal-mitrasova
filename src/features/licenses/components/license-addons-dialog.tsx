"use client"

import { useEffect, type JSX } from "react"
import { useForm, FormProvider, Controller } from "react-hook-form"
import { Loader2, Puzzle, Check } from "lucide-react"
import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useProduct } from "@/features/products"
import { useSyncLicenseAddons } from "../api/license.queries"
import type { License, SyncLicenseAddonItem } from "../@types/license"

interface LicenseAddonsFormValues {
  addons: Record<string, boolean>
}

interface LicenseAddonsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  license: License | null
}

export function LicenseAddonsDialog({
  open,
  onOpenChange,
  license,
}: LicenseAddonsDialogProps): JSX.Element {
  const syncMutation = useSyncLicenseAddons()

  const { data: product, isLoading: isLoadingProduct } = useProduct(
    license?.product_id ?? "",
    Boolean(license?.product_id) && open
  )

  const methods = useForm<LicenseAddonsFormValues>({
    defaultValues: {
      addons: {},
    },
  })

  const { handleSubmit, reset, control } = methods

  // Initialize selections from current license addons
  useEffect(() => {
    if (license && open) {
      const activeMap: Record<string, boolean> = {}
      const currentAddons =
        license.licenseAddons ?? license.license_addons ?? []
      currentAddons.forEach((item) => {
        if (item.status === "active") {
          activeMap[item.product_addon_id] = true
        }
      })
      reset({ addons: activeMap })
    }
  }, [license, open, reset])

  if (!license) {
    return <></>
  }

  const availableAddons = product?.addons ?? []

  const onSubmit = async (values: LicenseAddonsFormValues) => {
    try {
      const payloadAddons: SyncLicenseAddonItem[] = availableAddons.map(
        (addon) => ({
          product_addon_id: addon.id,
          status: values.addons?.[addon.id] ? "active" : "inactive",
        })
      )

      await syncMutation.mutateAsync({
        id: license.id,
        payload: { addons: payloadAddons },
      })
      onOpenChange(false)
    } catch {
      // Toast handled by query hook
    }
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div>
          <div className="text-sm font-bold text-foreground">
            Sinkronisasi Modul Addon Lisensi
          </div>
          <p className="text-[11px] font-normal text-muted-foreground">
            Pilih modul addon yang aktif untuk instance {license.nama_instance}.
          </p>
        </div>
      }
      className="max-w-md"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          {isLoadingProduct ? (
            <div className="flex items-center justify-center p-6 text-muted-foreground">
              <Loader2 size={16} className="animate-spin mr-2" />
              <span>Memuat modul addon produk...</span>
            </div>
          ) : availableAddons.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground border border-dashed border-border rounded-xl">
              <Puzzle size={24} className="mx-auto mb-2 opacity-40" />
              <p>Produk software ini belum memiliki daftar modul addon.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {availableAddons.map((addon) => (
                <Controller
                  key={addon.id}
                  control={control}
                  name={`addons.${addon.id}`}
                  render={({ field }) => {
                    const isChecked = Boolean(field.value)
                    return (
                      <div
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border transition-colors",
                          isChecked
                            ? "bg-primary/5 border-primary/30"
                            : "bg-card border-border"
                        )}
                      >
                        <div className="space-y-0.5 min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {addon.nama}
                            </span>
                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                              {addon.code}
                            </span>
                          </div>
                          {addon.description && (
                            <p className="text-[11px] text-muted-foreground truncate">
                              {addon.description}
                            </p>
                          )}
                        </div>

                        <Switch
                          checked={isChecked}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )
                  }}
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={syncMutation.isPending}
              className="h-9 px-4 text-xs font-semibold cursor-pointer rounded-xl"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={syncMutation.isPending || isLoadingProduct}
              className="h-9 px-4 gap-2 text-xs font-semibold cursor-pointer rounded-xl shadow-xs"
            >
              {syncMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              <span>Simpan Sinkronisasi</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
