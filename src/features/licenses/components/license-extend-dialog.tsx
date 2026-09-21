"use client"

import { useState, type JSX } from "react"
import { CalendarClock, Loader2 } from "lucide-react"
import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { useExtendLicense } from "../api/license.queries"
import { QUICK_EXTEND_OPTIONS } from "../constants"
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
  const [selectedDays, setSelectedDays] = useState<number | null>(30)
  const [customDate, setCustomDate] = useState<string>("")
  const extendMutation = useExtendLicense()

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

  const handleQuickExtend = async (days: number) => {
    try {
      await extendMutation.mutateAsync({
        id: license.id,
        payload: { days },
      })
      onOpenChange(false)
    } catch {
      // Toast handled by mutation hook
    }
  }

  const handleCustomExtend = async () => {
    if (!customDate) {
      return
    }
    try {
      await extendMutation.mutateAsync({
        id: license.id,
        payload: { expires_at: customDate },
      })
      onOpenChange(false)
    } catch {
      // Toast handled by mutation hook
    }
  }

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
      <div className="space-y-4 text-xs">
        {/* Current status */}
        <div className="p-3 rounded-xl border border-border bg-muted/30 flex items-center justify-between">
          <span className="text-muted-foreground">Masa Aktif Saat Ini:</span>
          <span className="font-semibold text-foreground font-mono">{currentExpiry}</span>
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
                variant={selectedDays === opt.days ? "default" : "outline"}
                size="sm"
                disabled={extendMutation.isPending}
                onClick={() => {
                  setSelectedDays(opt.days)
                  setCustomDate("")
                  void handleQuickExtend(opt.days)
                }}
                className="h-8 text-xs justify-center cursor-pointer gap-1.5 font-medium"
              >
                <CalendarClock size={13} />
                <span>{opt.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Date Option */}
        <div className="space-y-2 pt-2 border-t border-border">
          <label className="text-xs font-semibold text-foreground">
            Atau Tentukan Tanggal Kedaluwarsa Baru
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <DatePicker
                value={customDate}
                onChange={(date) => {
                  setCustomDate(date)
                  setSelectedDays(null)
                }}
                placeholder="Pilih tanggal baru..."
              />
            </div>
            <Button
              type="button"
              size="sm"
              disabled={!customDate || extendMutation.isPending}
              onClick={handleCustomExtend}
              className="cursor-pointer gap-1.5 text-xs font-medium"
            >
              {extendMutation.isPending && (
                <Loader2 size={13} className="animate-spin" />
              )}
              <span>Terapkan</span>
            </Button>
          </div>
        </div>
      </div>
    </BaseDialog>
  )
}
