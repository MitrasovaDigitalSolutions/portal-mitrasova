"use client"

import { motion, type Variants } from "framer-motion"
import {
  AlertTriangle,
  CreditCard,
  KeyRound,
  Users2,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { formatRupiah } from "@/hooks/use-format-rupiah"
import type { DashboardOverview } from "../@types/dashboard"
import { cn } from "@/lib/utils"

interface DashboardMetricsGridProps {
  overview: DashboardOverview
}

export function DashboardMetricsGrid({ overview }: DashboardMetricsGridProps) {
  const licenseRate =
    overview.total_licenses > 0
      ? Math.round((overview.active_licenses / overview.total_licenses) * 100)
      : 0

  const cards = [
    {
      title: "Pendapatan Bulan Ini",
      value: formatRupiah(overview.revenue_this_month),
      badge: "Bulan Berjalan",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
      description: "Total omzet terverifikasi",
      icon: CreditCard,
      iconWrapper: "bg-emerald-500/10 text-emerald-600 border-emerald-500/25 dark:text-emerald-400",
    },
    {
      title: "Tagihan Belum Dibayar",
      value: formatRupiah(overview.unpaid_invoices_amount),
      badge: `${overview.unpaid_invoices_count} Invoice`,
      badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
      description: "Menunggu pelunasan klien",
      icon: AlertTriangle,
      iconWrapper: "bg-amber-500/10 text-amber-600 border-amber-500/25 dark:text-amber-400",
    },
    {
      title: "Lisensi Aktif",
      value: `${overview.active_licenses} / ${overview.total_licenses}`,
      badge: `${licenseRate}% Aktif`,
      badgeColor:
        licenseRate >= 70
          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
          : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
      description: `${overview.expired_licenses} lisensi kedaluwarsa`,
      icon: KeyRound,
      iconWrapper: "bg-primary/10 text-primary border-primary/25",
    },
    {
      title: "Klien & Produk",
      value: `${overview.total_clients} Klien`,
      badge: `${overview.total_products} Produk`,
      badgeColor: "bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400",
      description: "Terdaftar dalam ekosistem",
      icon: Users2,
      iconWrapper: "bg-sky-500/10 text-sky-600 border-sky-500/25 dark:text-sky-400",
    },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div key={index} variants={itemVariants}>
            <Card className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4.5 shadow-2xs transition-all hover:border-primary/40 hover:shadow-md">
              {/* Top Row: Title + Icon */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-muted-foreground truncate">
                  {card.title}
                </span>
                <div
                  className={cn(
                    "flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105",
                    card.iconWrapper
                  )}
                >
                  <Icon size={16} />
                </div>
              </div>

              {/* Middle Row: Main Metric Value */}
              <div className="mt-2.5">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground truncate">
                  {card.value}
                </h3>
              </div>

              {/* Bottom Row: Badge & Subtext */}
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-2.5">
                <span className="truncate text-[11px] font-medium text-muted-foreground">
                  {card.description}
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold leading-none tracking-tight",
                    card.badgeColor
                  )}
                >
                  {card.badge}
                </span>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
