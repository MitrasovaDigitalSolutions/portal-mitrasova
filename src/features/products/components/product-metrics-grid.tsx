"use client"

import type React from "react"
import { motion, type Variants } from "framer-motion"
import { Package, CheckCircle2, XCircle, Puzzle } from "lucide-react"
import { Card } from "@/components/ui/card"

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
}

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Products */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Produk
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Package className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">
            {totalProducts}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Katalog sistem Mitrasova
          </div>
        </Card>
      </motion.div>

      {/* Active Products */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Produk Aktif
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {activeCount}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Tersedia untuk lisensi
          </div>
        </Card>
      </motion.div>

      {/* Inactive Products */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Non-Aktif
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              <XCircle className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">
            {inactiveCount}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Diarsipkan / tidak aktif
          </div>
        </Card>
      </motion.div>

      {/* Total Addons */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Modul Addon
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <Puzzle className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">
            {totalAddons}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Modul tambahan terdaftar
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
