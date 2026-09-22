"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import type { InvoiceStatus } from "../@types/invoice"

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus | string
  className?: string
  showDot?: boolean
}

interface StatusConfig {
  label: string
  bgClass: string
  dotClass: string
  pulse?: boolean
}

const STATUS_CONFIGS: Record<string, StatusConfig> = {
  paid: {
    label: "Lunas",
    bgClass:
      "bg-emerald-500/10 text-emerald-800 border-emerald-300/70 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-700/50",
    dotClass: "bg-emerald-500",
  },
  unpaid: {
    label: "Belum Dibayar",
    bgClass:
      "bg-amber-500/10 text-amber-800 border-amber-300/70 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-700/50",
    dotClass: "bg-amber-500",
    pulse: true,
  },
  expired: {
    label: "Kedaluwarsa",
    bgClass:
      "bg-rose-500/10 text-rose-800 border-rose-300/70 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-700/50",
    dotClass: "bg-rose-500",
  },
  cancelled: {
    label: "Dibatalkan",
    bgClass:
      "bg-slate-500/10 text-slate-700 border-slate-300/70 dark:bg-slate-500/15 dark:text-slate-400 dark:border-slate-700/50",
    dotClass: "bg-slate-400 dark:bg-slate-500",
  },
}

export function InvoiceStatusBadge({
  status,
  className,
  showDot = true,
}: InvoiceStatusBadgeProps): React.JSX.Element {
  const normalized = (status || "").toLowerCase().trim()
  const config = STATUS_CONFIGS[normalized] ?? {
    label: status || "—",
    bgClass:
      "bg-secondary text-secondary-foreground border-border",
    dotClass: "bg-muted-foreground",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold select-none transition-colors",
        config.bgClass,
        className
      )}
    >
      {showDot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {config.pulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                config.dotClass
              )}
            />
          )}
          <span
            className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", config.dotClass)}
          />
        </span>
      )}
      <span>{config.label}</span>
    </span>
  )
}
