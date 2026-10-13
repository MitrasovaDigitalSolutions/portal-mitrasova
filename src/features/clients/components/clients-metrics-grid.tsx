"use client"

import type React from "react"
import { AlertCircle, CheckCircle2, KeyRound, Users } from "lucide-react"
import type { ClientMetrics } from "../@types/client"

interface ClientsMetricsGridProps {
  metrics: ClientMetrics
}

export function ClientsMetricsGrid({
  metrics,
}: ClientsMetricsGridProps): React.JSX.Element {
  const cards = [
    {
      title: "Total Klien",
      value: metrics.totalClients,
      description: "Pelanggan terdaftar",
      icon: Users,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      title: "Klien Aktif",
      value: metrics.activeClients,
      description: "Lisensi berjalan",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30 dark:border-emerald-500/20",
    },
    {
      title: "Total Lisensi",
      value: metrics.totalLicenses,
      description: "Instance terbit",
      icon: KeyRound,
      iconColor: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/30 dark:border-indigo-500/20",
    },
    {
      title: "Lisensi Expired",
      value: metrics.expiredLicenses,
      description: "Perlu perpanjangan",
      icon: AlertCircle,
      iconColor: "text-amber-700 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30 dark:border-amber-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-3 shadow-2xs transition-all hover:border-primary/25 hover:shadow-xs sm:p-3.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[11px] font-medium text-muted-foreground">
                {card.title}
              </span>
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-lg border ${card.bgColor} ${card.borderColor} ${card.iconColor}`}
              >
                <Icon size={14} />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <div className="font-mono text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {card.value}
              </div>
              <p className="truncate text-[10px] text-muted-foreground">
                {card.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
