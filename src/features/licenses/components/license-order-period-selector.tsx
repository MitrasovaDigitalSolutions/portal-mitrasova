"use client"

import type { JSX } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface LicenseOrderPeriodSelectorProps {
  billingPeriod: "monthly" | "annual"
  onSelectPeriod: (period: "monthly" | "annual") => void
}

export function LicenseOrderPeriodSelector({
  billingPeriod,
  onSelectPeriod,
}: LicenseOrderPeriodSelectorProps): JSX.Element {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-foreground">
        Pilih Periode Penagihan
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onSelectPeriod("monthly")}
          className={cn(
            "flex items-center justify-between rounded-xl border p-3 text-left transition-all cursor-pointer",
            billingPeriod === "monthly"
              ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
              : "border-border bg-card/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          )}
        >
          <div>
            <div className="font-semibold text-xs text-foreground">
              Bulanan (Monthly)
            </div>
            <div className="text-[11px] text-muted-foreground">
              Perpanjangan per 1 bulan
            </div>
          </div>
          {billingPeriod === "monthly" && (
            <Check size={16} className="text-primary" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectPeriod("annual")}
          className={cn(
            "flex items-center justify-between rounded-xl border p-3 text-left transition-all cursor-pointer relative",
            billingPeriod === "annual"
              ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
              : "border-border bg-card/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          )}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-foreground">
                Tahunan (Annual)
              </span>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                Hemat
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              Perpanjangan per 12 bulan
            </div>
          </div>
          {billingPeriod === "annual" && (
            <Check size={16} className="text-primary" />
          )}
        </button>
      </div>
    </div>
  )
}
