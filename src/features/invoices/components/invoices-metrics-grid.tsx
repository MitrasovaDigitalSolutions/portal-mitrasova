"use client"

import type React from "react"
import { motion, type Variants } from "framer-motion"
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/utils"

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Invoices */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Faktur
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <FileText className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">
            {totalInvoices}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Total catatan faktur
          </div>
        </Card>
      </motion.div>

      {/* Unpaid Invoices */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Belum Dibayar
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <AlertTriangle className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {unpaidCount}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Menunggu pelunasan
          </div>
        </Card>
      </motion.div>

      {/* Paid Invoices */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Faktur Lunas
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {paidCount}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Pembayaran terkonfirmasi
          </div>
        </Card>
      </motion.div>

      {/* Page Amount Total */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Nilai Tagihan Halaman Ini
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <DollarSign className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-foreground truncate">
            {formatCurrency(pageAmountTotal)}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Subtotal invoice ditampilkan
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
