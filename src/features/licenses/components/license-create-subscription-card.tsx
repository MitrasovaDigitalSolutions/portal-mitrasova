"use client"

import { useMemo, type JSX } from "react"
import { Calendar } from "lucide-react"
import {
  FormDatePicker,
  FormNumberInput,
  FormSelect,
} from "@/components/forms"
import { LICENSE_STATUSES, SUBSCRIPTION_TYPES } from "../constants"

interface LicenseCreateSubscriptionCardProps {
  isLifetime: boolean
}

export function LicenseCreateSubscriptionCard({
  isLifetime,
}: LicenseCreateSubscriptionCardProps): JSX.Element {
  const subscriptionOptions = useMemo(
    () => [
      {
        value: "annual",
        label: SUBSCRIPTION_TYPES.annual.label,
      },
      {
        value: "monthly",
        label: SUBSCRIPTION_TYPES.monthly.label,
      },
      {
        value: "lifetime",
        label: SUBSCRIPTION_TYPES.lifetime.label,
      },
      {
        value: "trial",
        label: SUBSCRIPTION_TYPES.trial.label,
      },
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

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Calendar size={15} />
        </div>
        <div>
          <h2 className="text-xs font-bold text-foreground">
            3. Skema Langganan & Masa Aktif
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Tentukan durasi periode berlangganan software dan tenggat masa aktif lisensi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormSelect
          name="subscription_type"
          label="Tipe Langganan"
          options={subscriptionOptions}
        />

        <FormSelect
          name="status"
          label="Status Awal Lisensi"
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
            <div className="flex h-9 items-center rounded-lg border border-dashed border-border bg-muted/40 px-3 text-xs text-muted-foreground">
              Paket Seumur Hidup (Lifetime) — Tidak ada kedaluwarsa
            </div>
          </div>
        )}

        <FormNumberInput
          name="grace_period_days"
          label="Masa Tenggang (Grace Period - Hari)"
          placeholder="7"
          min={0}
          max={90}
          allowNegative={false}
          allowDecimal={false}
        />
      </div>
    </div>
  )
}
