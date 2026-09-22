"use client"

import type React from "react"
import { motion, type Variants } from "framer-motion"
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
} from "lucide-react"
import { formatCurrency } from "@/utils"

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
}

interface InvoicesMetricsGridProps {
  totalInvoices: number
  unpaidCount: number
  paidCount: number
  pageAmountTotal: number
}

export function InvoicesMetricsGrid({
  totalInvoices,
  unpaidCount,
  paidCount,
  pageAmountTotal,
}: InvoicesMetricsGridProps): React.JSX.Element {
  const cards = [
    {
      title: "Total Invoices",
      value: totalInvoices,
      description: "Arsip tagihan terdaftar",
      icon: FileText,
      iconWrapper: "bg-primary/10 text-primary border-primary/20",
      valueColor: "text-foreground",
      isCurrency: false,
    },
    {
      title: "Unpaid Invoices",
      value: unpaidCount,
      description: "Menunggu pelunasan",
      icon: AlertTriangle,
      iconWrapper:
        "bg-amber-500/10 text-amber-800 border-amber-500/30 dark:border-amber-500/20 dark:text-amber-400",
      valueColor: "text-amber-800 dark:text-amber-400",
      isCurrency: false,
    },
    {
      title: "Paid Invoices",
      value: paidCount,
      description: "Pembayaran terverifikasi",
      icon: CheckCircle2,
      iconWrapper:
        "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:border-emerald-500/20 dark:text-emerald-400",
      valueColor: "text-emerald-700 dark:text-emerald-400",
      isCurrency: false,
    },
    {
      title: "Subtotal (Halaman Ini)",
      value: pageAmountTotal,
      description: "Nilai faktur tabel aktif",
      icon: DollarSign,
      iconWrapper:
        "bg-sky-500/10 text-sky-700 border-sky-500/30 dark:border-sky-500/20 dark:text-sky-400",
      valueColor: "text-foreground",
      isCurrency: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <motion.div key={idx} variants={itemVariants}>
            <div className="rounded-xl border border-border bg-card p-3 sm:p-3.5 shadow-2xs transition-all hover:border-primary/30 hover:shadow-xs flex flex-col justify-between h-full">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-muted-foreground truncate">
                  {card.title}
                </span>
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-lg border ${card.iconWrapper}`}
                >
                  <Icon size={14} />
                </div>
              </div>

              <div className="mt-2 flex flex-col justify-end">
                <div
                  className={`font-mono font-bold tracking-tight truncate ${
                    card.isCurrency ? "text-base sm:text-lg" : "text-lg sm:text-xl"
                  } ${card.valueColor}`}
                >
                  {card.isCurrency
                    ? formatCurrency(Number(card.value))
                    : card.value}
                </div>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {card.description}
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
