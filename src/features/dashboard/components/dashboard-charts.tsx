"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { motion } from "framer-motion"
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { formatRupiah } from "@/hooks/use-format-rupiah"
import type { DashboardOverview, ExpiringLicenseItem } from "../@types/dashboard"
import { cn } from "@/lib/utils"

interface DashboardChartsProps {
  overview: DashboardOverview
  expiringSoon: ExpiringLicenseItem[]
}

export function DashboardCharts({
  overview,
  expiringSoon,
}: DashboardChartsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // ─── 1. License Distribution Donut Data ──────────────────────────────────────
  const expiringCount = expiringSoon.length
  // Active licenses excluding those already marked as expiring soon for clear visual separation
  const healthyActiveCount = Math.max(
    0,
    overview.active_licenses - expiringCount
  )
  const expiredCount = overview.expired_licenses

  const isLicenseDataEmpty =
    overview.total_licenses === 0 &&
    overview.active_licenses === 0 &&
    expiredCount === 0

  const licensePieData = isLicenseDataEmpty
    ? [{ name: "Belum Ada Data", value: 1, color: "#94a3b8" }]
    : [
        {
          name: "Healthy Active",
          value: healthyActiveCount,
          color: "#059669",
        },
        {
          name: "Expiring Soon",
          value: expiringCount,
          color: "#d97706",
        },
        {
          name: "Grace / Expired",
          value: expiredCount,
          color: "#e11d48",
        },
      ].filter((item) => item.value > 0)

  // ─── 2. Financial Bar Chart Data ─────────────────────────────────────────────
  const financialData = [
    {
      kategori: "Revenue MTD",
      nominal: overview.revenue_this_month,
      color: "#059669",
    },
    {
      kategori: "Outstanding",
      nominal: overview.unpaid_invoices_amount,
      color: "#d97706",
    },
  ]

  // Volume Bar Data (Klien vs Produk vs Lisensi vs Invoices)
  const volumeData = [
    { name: "Mitra Klien", jumlah: overview.total_clients, fill: "#0284c7" },
    { name: "SKU Produk", jumlah: overview.total_products, fill: "#6366f1" },
    { name: "Lisensi", jumlah: overview.total_licenses, fill: "#059669" },
    { name: "Invoice", jumlah: overview.unpaid_invoices_count, fill: "#d97706" },
  ]

  const [activeTab, setActiveTab] = useState<"finance" | "volume">("finance")

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:gap-3 lg:grid-cols-12">
      {/* Chart 1: License Health & Distribution (Donut) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        className="lg:col-span-5"
      >
        <Card className="flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-3.5 sm:p-4 shadow-2xs">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <PieChartIcon size={14} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  License Health & Distribution
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  Indeks utilisasi & pipeline perpanjangan
                </p>
              </div>
            </div>
            <span className="font-mono rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              {overview.total_licenses} Total
            </span>
          </div>

          {/* Donut Body */}
          <div className="relative my-1 flex min-h-[170px] w-full items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0]
                        return (
                          <div className="rounded-xl border border-border bg-popover p-2 text-xs shadow-md">
                            <div className="flex items-center gap-1.5 font-bold text-popover-foreground">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: data.payload.color }}
                              />
                              <span>{data.name}</span>
                            </div>
                            <div className="mt-1 text-[11px] font-semibold text-muted-foreground">
                              Volume:{" "}
                              <span className="font-bold text-foreground">
                                {data.value} lisensi
                              </span>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Pie
                    data={licensePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {licensePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-36 w-36 rounded-full border-4 border-muted animate-pulse" />
            )}

            {/* Inner Total Pill */}
            <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
              <span className="font-mono text-lg font-black text-foreground leading-none">
                {overview.active_licenses}
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                Aktif
              </span>
            </div>
          </div>

          {/* Legend Pills */}
          <div className="grid grid-cols-3 gap-1.5 border-t border-border/60 pt-2.5 text-center">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-1.5">
              <span className="block text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tight">
                Healthy
              </span>
              <span className="font-mono text-xs font-black text-foreground">
                {healthyActiveCount}
              </span>
            </div>

            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-1.5">
              <span className="block text-[9px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-tight">
                Expiring
              </span>
              <span className="font-mono text-xs font-black text-foreground">
                {expiringCount}
              </span>
            </div>

            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-1.5">
              <span className="block text-[9px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-tight">
                Expired
              </span>
              <span className="font-mono text-xs font-black text-foreground">
                {expiredCount}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Chart 2: Cash Flow & Ecosystem Volume (Bar) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.12 }}
        className="lg:col-span-7"
      >
        <Card className="flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-3.5 sm:p-4 shadow-2xs">
          {/* Header with Switcher Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <BarChart3 size={14} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  {activeTab === "finance"
                    ? "Cash Flow vs Outstanding Receivables"
                    : "Platform Deployment Volume"}
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  {activeTab === "finance"
                    ? "Realisasi pendapatan MTD vs piutang terbuka"
                    : "Distribusi entitas ekosistem operasional"}
                </p>
              </div>
            </div>

            {/* Toggle Tabs */}
            <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/60 p-0.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab("finance")}
                className={cn(
                  "cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all select-none",
                  activeTab === "finance"
                    ? "bg-card text-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Arus Finansial
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("volume")}
                className={cn(
                  "cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all select-none",
                  activeTab === "volume"
                    ? "bg-card text-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Volume Deployment
              </button>
            </div>
          </div>

          {/* Bar Chart Area */}
          <div className="my-2 flex-1 min-h-[175px] w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height={175}>
                {activeTab === "finance" ? (
                  <BarChart
                    data={financialData}
                    margin={{ top: 8, right: 10, left: 10, bottom: 4 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border)"
                      opacity={0.6}
                    />
                    <XAxis
                      dataKey="kategori"
                      stroke="var(--muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => {
                        if (value >= 1_000_000) {
                          return `${(value / 1_000_000).toFixed(0)} Jt`
                        }
                        if (value >= 1_000) {
                          return `${(value / 1_000).toFixed(0)} Rb`
                        }
                        return String(value)
                      }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0]
                          return (
                            <div className="rounded-xl border border-border bg-popover p-2.5 text-xs shadow-md">
                              <span className="font-bold text-popover-foreground">
                                {data.payload.kategori}
                              </span>
                              <div className="mt-1 font-mono text-sm font-black text-primary">
                                {formatRupiah(Number(data.value))}
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar
                      dataKey="nominal"
                      radius={[6, 6, 0, 0]}
                      barSize={40}
                    >
                      {financialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <BarChart
                    data={volumeData}
                    margin={{ top: 8, right: 10, left: 10, bottom: 4 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border)"
                      opacity={0.6}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="var(--muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0]
                          return (
                            <div className="rounded-xl border border-border bg-popover p-2.5 text-xs shadow-md">
                              <span className="font-bold text-popover-foreground">
                                {data.payload.name}
                              </span>
                              <div className="mt-1 font-mono text-sm font-black text-foreground">
                                {data.value} entitas
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar
                      dataKey="jumlah"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    >
                      {volumeData.map((entry, index) => (
                        <Cell key={`cell-vol-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-muted/30 rounded-xl animate-pulse" />
            )}
          </div>

          {/* Bottom Insights Footnote */}
          <div className="flex items-center justify-between border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5 truncate">
              <TrendingUp size={13} className="text-primary shrink-0" />
              <span className="truncate">
                {overview.unpaid_invoices_count > 0
                  ? `${overview.unpaid_invoices_count} faktur terbuka menunggu penyelesaian`
                  : "Seluruh kewajiban pembayaran lunas terverifikasi"}
              </span>
            </div>
            <span className="shrink-0 font-mono font-bold text-foreground">
              {formatRupiah(overview.revenue_this_month)}
            </span>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
