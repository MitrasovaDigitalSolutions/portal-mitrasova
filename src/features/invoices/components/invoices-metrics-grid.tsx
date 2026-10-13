"use client"

import type React from "react"
import { AlertTriangle, CheckCircle2, FileText } from "lucide-react"

interface InvoicesMetricsGridProps {
  totalInvoices: number
  unpaidCount: number
  paidCount: number
}

export function InvoicesMetricsGrid({
  totalInvoices,
  unpaidCount,
  paidCount,
}: InvoicesMetricsGridProps): React.JSX.Element {
  const cards = [
    {
      title: "Total Invoices",
      value: totalInvoices,
      description: "Invoice yang dibuat",
      icon: FileText,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      title: "Unpaid Invoices",
      value: unpaidCount,
      description: "Menunggu pelunasan",
      icon: AlertTriangle,
      iconColor: "text-amber-700 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30 dark:border-amber-500/20",
    },
    {
      title: "Paid Invoices",
      value: paidCount,
      description: "Pembayaran berhasil",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30 dark:border-emerald-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
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
