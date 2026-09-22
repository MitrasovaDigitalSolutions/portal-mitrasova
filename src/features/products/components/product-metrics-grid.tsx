"use client"

import type React from "react"
import { CheckCircle2, Layers, Package, XCircle } from "lucide-react"

interface ProductMetricsGridProps {
  totalProducts: number
  activeCount: number
  inactiveCount: number
  totalAddons: number
}

export function ProductMetricsGrid({
  totalProducts,
  activeCount,
  inactiveCount,
  totalAddons,
}: ProductMetricsGridProps): React.JSX.Element {
  const cards = [
    {
      title: "Total Produk",
      value: totalProducts,
      description: "Katalog sistem Mitrasova",
      icon: Package,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      title: "Produk Aktif",
      value: activeCount,
      description: "Tersedia untuk lisensi",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30 dark:border-emerald-500/20",
    },
    {
      title: "Non-Aktif",
      value: inactiveCount,
      description: "Diarsipkan / dinonaktifkan",
      icon: XCircle,
      iconColor: "text-zinc-600 dark:text-zinc-400",
      bgColor: "bg-zinc-500/10",
      borderColor: "border-zinc-500/30 dark:border-zinc-500/20",
    },
    {
      title: "Total Modul Addon",
      value: totalAddons,
      description: "Fitur tambahan terdaftar",
      icon: Layers,
      iconColor: "text-sky-600 dark:text-sky-400",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/30 dark:border-sky-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="rounded-xl border border-border bg-card p-3 sm:p-3.5 shadow-2xs transition-all hover:border-primary/25 hover:shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-muted-foreground truncate">
                {card.title}
              </span>
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-lg border ${card.bgColor} ${card.borderColor} ${card.iconColor}`}
              >
                <Icon size={14} />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <div className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-mono">
                {card.value}
              </div>
              <p className="text-[10px] text-muted-foreground truncate">
                {card.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
