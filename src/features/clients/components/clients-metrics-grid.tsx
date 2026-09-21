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
      title: "Total Klien Terdaftar",
      value: metrics.totalClients,
      description: "Pelanggan & mitra sistem",
      icon: Users,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      title: "Klien Lisensi Aktif",
      value: metrics.activeClients,
      description: "Memiliki lisensi berjalan",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Total Lisensi Instance",
      value: metrics.totalLicenses,
      description: "Instance aplikasi terbit",
      icon: KeyRound,
      iconColor: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
    {
      title: "Lisensi Expired / Habis",
      value: metrics.expiredLicenses,
      description: "Perlu perpanjangan masa aktif",
      icon: AlertCircle,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {card.title}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl border ${card.bgColor} ${card.borderColor} ${card.iconColor}`}
              >
                <Icon size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {card.value}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {card.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
