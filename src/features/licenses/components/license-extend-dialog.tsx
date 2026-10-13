"use client"

import { useEffect, type JSX } from "react"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarClock, Loader2 } from "lucide-react"
import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import { FormDatePicker } from "@/components/forms/form-date-picker"
import { useExtendLicense } from "../api/license.queries"
import { QUICK_EXTEND_OPTIONS } from "../constants"
import {
  licenseExtendSchema,
  type LicenseExtendValues,
} from "../validations/license-extend.schema"
import type { License } from "../@types/license"

interface LicenseExtendDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  license: License | null
}

export function LicenseExtendDialog({
  open,
  onOpenChange,
  license,
}: LicenseExtendDialogProps): JSX.Element {
  const extendMutation = useExtendLicense()

  const methods = useForm<LicenseExtendValues>({
    resolver: zodResolver(licenseExtendSchema),
    defaultValues: {
      extend_mode: "days",
      days: 30,
      expires_at: "",
    },
  })

  const { handleSubmit, setValue, reset, control } = methods

  const currentMode = useWatch({ control, name: "extend_mode" })
  const selectedDays = useWatch({ control, name: "days" })
  const customDate = useWatch({ control, name: "expires_at" })

  useEffect(() => {
    if (open) {
      reset({
        extend_mode: "days",
        days: 30,
        expires_at: "",
      })
    }
  }, [open, reset])

  useEffect(() => {
    if (customDate) {
      setValue("extend_mode", "custom_date")
      setValue("days", undefined)
    }
  }, [customDate, setValue])

  if (!license) {
    return <></>
  }

  const currentExpiry = license.expires_at
    ? new Date(license.expires_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Lifetime (Tidak ada kedaluwarsa)"

  const onSubmit = async (values: LicenseExtendValues) => {
    try {
      if (values.extend_mode === "custom_date" && values.expires_at) {
        await extendMutation.mutateAsync({
          id: license.id,
          payload: {
            exact_date: values.expires_at,
            expires_at: values.expires_at,
          },
        })
      } else if (values.days) {
        await extendMutation.mutateAsync({
          id: license.id,
          payload: { days: values.days },
        })
      }
      onOpenChange(false)
    } catch {
      // Toast handled by mutation hook
    }
  }

  const handleQuickSelect = (days: number) => {
    setValue("extend_mode", "days")
    setValue("days", days)
    setValue("expires_at", "")
  }

  const isSubmitDisabled =
    extendMutation.isPending ||
    (currentMode === "custom_date" && !customDate) ||
    (currentMode === "days" && !selectedDays)

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div>
          <div className="text-sm font-bold text-foreground">
            Perpanjang Masa Aktif Lisensi
          </div>
          <p className="text-[11px] font-normal text-muted-foreground">
            Instance: {license.nama_instance}
          </p>
        </div>
      }
      className="max-w-md"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4 text-xs"
        >
          {/* Current status */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3">
            <span className="text-muted-foreground">Masa Aktif Saat Ini:</span>
            <span className="font-mono font-semibold text-foreground">
              {currentExpiry}
            </span>
          </div>

          {/* Quick Extend Options */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Opsi Cepat Perpanjangan
            </label>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_EXTEND_OPTIONS.map((opt) => (
                <Button
                  key={opt.days}
                  type="button"
                  variant={
                    currentMode === "days" && selectedDays === opt.days
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  disabled={extendMutation.isPending}
                  onClick={() => handleQuickSelect(opt.days)}
                  className="h-8 cursor-pointer justify-center gap-1.5 text-xs font-medium"
                >
                  <CalendarClock size={13} />
                  <span>{opt.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Date Option */}
          <div className="space-y-2 border-t border-border pt-2">
            <label className="text-xs font-semibold text-foreground">
              Atau Tentukan Tanggal Kedaluwarsa Baru
            </label>
            <FormDatePicker<LicenseExtendValues>
              name="expires_at"
              placeholder="Pilih tanggal kedaluwarsa baru..."
              size="sm"
              captionLayout="dropdown"
            />
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <Button
              type="button"
              variant="outline"
              disabled={extendMutation.isPending}
              onClick={() => onOpenChange(false)}
              className="h-9 cursor-pointer rounded-xl px-4 text-xs font-semibold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="h-9 cursor-pointer gap-2 rounded-xl px-4 text-xs font-semibold shadow-xs"
            >
              {extendMutation.isPending && (
                <Loader2 size={14} className="animate-spin" />
              )}
              <span>Terapkan Perpanjangan</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
