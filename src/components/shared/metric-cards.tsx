"use client"

import type { JSX, ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type MetricTone =
  "primary" | "emerald" | "amber" | "rose" | "sky" | "indigo"

export interface MetricCardItem {
  title: string
  value: ReactNode
  description: string
  icon: LucideIcon
  tone?: MetricTone
}

export interface MetricCardsProps {
  items: MetricCardItem[]
  /** Jumlah kolom pada layar >= sm. Default mengikuti jumlah item (maks 4). */
  columns?: 2 | 3 | 4
  className?: string
}

const TONE_CLASSES: Record<MetricTone, string> = {
  primary: "bg-primary/10 border-primary/20 text-primary",
  emerald:
    "bg-emerald-500/10 border-emerald-500/30 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  amber:
    "bg-amber-500/10 border-amber-500/30 dark:border-amber-500/20 text-amber-700 dark:text-amber-400",
  rose: "bg-rose-500/10 border-rose-500/30 dark:border-rose-500/20 text-rose-600 dark:text-rose-400",
  sky: "bg-sky-500/10 border-sky-500/30 dark:border-sky-500/20 text-sky-600 dark:text-sky-400",
  indigo:
    "bg-indigo-500/10 border-indigo-500/30 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
}

const COLUMN_CLASSES: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
}

/** Kartu metrik bergaya kartu Clients/Invoices (ringkas, ikon di kanan atas). */
export function MetricCards({
  items,
  columns,
  className,
}: MetricCardsProps): JSX.Element {
  const resolvedColumns =
    columns ?? (Math.min(Math.max(items.length, 2), 4) as 2 | 3 | 4)

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-2.5 sm:gap-3",
        COLUMN_CLASSES[resolvedColumns],
        className
      )}
    >
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.title}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-3 shadow-2xs transition-all hover:border-primary/25 hover:shadow-xs sm:p-3.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[11px] font-medium text-muted-foreground">
                {item.title}
              </span>
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-lg border",
                  TONE_CLASSES[item.tone ?? "primary"]
                )}
              >
                <Icon size={14} />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <div className="truncate font-mono text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {item.value}
              </div>
              <p className="truncate text-[10px] text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
