"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import {
  AlertTriangle,
  ArrowUpRight,
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
      title: "Revenue Realization (MTD)",
      value: formatRupiah(overview.revenue_this_month),
      badge: "Paid Invoices",
      badgeColor:
        "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:border-emerald-500/20 dark:text-emerald-400",
      description: "Realisasi pembayaran terverifikasi",
      icon: CreditCard,
      iconWrapper:
        "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:border-emerald-500/20 dark:text-emerald-400",
      href: "/invoices",
    },
    {
      title: "Outstanding Receivables",
      value: formatRupiah(overview.unpaid_invoices_amount),
      badge: `${overview.unpaid_invoices_count} Terbuka`,
      badgeColor:
        "bg-amber-500/10 text-amber-800 border-amber-500/30 dark:border-amber-500/20 dark:text-amber-400",
      description: "Piutang menunggu pelunasan",
      icon: AlertTriangle,
      iconWrapper:
        "bg-amber-500/10 text-amber-800 border-amber-500/30 dark:border-amber-500/20 dark:text-amber-400",
      href: "/invoices",
    },
    {
      title: "Active Deployments",
      value: `${overview.active_licenses} / ${overview.total_licenses}`,
      badge: `${licenseRate}% Health`,
      badgeColor:
        licenseRate >= 70
          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:border-emerald-500/20 dark:text-emerald-400"
          : "bg-amber-500/10 text-amber-800 border-amber-500/30 dark:border-amber-500/20 dark:text-amber-400",
      description: `${overview.expired_licenses} lisensi kedaluwarsa`,
      icon: KeyRound,
      iconWrapper: "bg-primary/10 text-primary border-primary/20",
      href: "/licenses",
    },
    {
      title: "Client Accounts & Catalog",
      value: `${overview.total_clients} Mitra`,
      badge: `${overview.total_products} SKU Produk`,
      badgeColor:
        "bg-sky-500/10 text-sky-700 border-sky-500/30 dark:border-sky-500/20 dark:text-sky-400",
      description: "Entitas ekosistem aktif",
      icon: Users2,
      iconWrapper:
        "bg-sky-500/10 text-sky-700 border-sky-500/30 dark:border-sky-500/20 dark:text-sky-400",
      href: "/clients",
    },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-3"
    >
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div key={index} variants={itemVariants}>
            <Link href={card.href} className="block h-full outline-none">
              <Card className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-3 sm:p-3.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xs cursor-pointer">
                {/* Top Row: Title + Icon with arrow affordance */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-muted-foreground truncate">
                    {card.title}
                  </span>
                  <div className="flex items-center gap-1">
                    <div
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 group-hover:scale-105",
                        card.iconWrapper
                      )}
                    >
                      <Icon size={14} />
                    </div>
                    <ArrowUpRight
                      size={13}
                      className="text-muted-foreground/50 transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                    />
                  </div>
                </div>

                {/* Middle Row: Main Metric Value */}
                <div className="mt-2">
                  <h3 className="font-mono text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
                    {card.value}
                  </h3>
                </div>

                {/* Bottom Row: Badge & Subtext */}
                <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/60 pt-2 text-[10px]">
                  <span className="truncate font-medium text-muted-foreground">
                    {card.description}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-1.5 py-0.2 font-bold leading-none tracking-tight",
                      card.badgeColor
                    )}
                  >
                    {card.badge}
                  </span>
                </div>
              </Card>
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
