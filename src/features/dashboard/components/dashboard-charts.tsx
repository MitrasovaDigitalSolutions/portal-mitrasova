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
          name: "Lisensi Aktif Sehat",
          value: healthyActiveCount,
          color: "#059669",
        },
        {
          name: "Akan Kedaluwarsa",
          value: expiringCount,
          color: "#f59e0b",
        },
        {
          name: "Kedaluwarsa",
          value: expiredCount,
          color: "#ef4444",
        },
      ].filter((item) => item.value > 0)

  // ─── 2. Financial Bar Chart Data ─────────────────────────────────────────────
  const financialData = [
    {
      kategori: "Omzet Bulan Ini",
      nominal: overview.revenue_this_month,
      color: "#059669",
    },
    {
      kategori: "Tagihan Tertunda",
      nominal: overview.unpaid_invoices_amount,
      color: "#f59e0b",
    },
  ]

  // Volume Bar Data (Klien vs Produk vs Lisensi)
  const volumeData = [
    { name: "Klien", jumlah: overview.total_clients, fill: "#0284c7" },
    { name: "Produk", jumlah: overview.total_products, fill: "#8b5cf6" },
    { name: "Lisensi", jumlah: overview.total_licenses, fill: "#059669" },
    { name: "Tagihan", jumlah: overview.unpaid_invoices_count, fill: "#f59e0b" },
  ]

  const [activeTab, setActiveTab] = useState<"finance" | "volume">("finance")

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Chart 1: Status Distribusi Lisensi (Donut) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="lg:col-span-5"
      >
        <Card className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-2xs">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <PieChartIcon size={15} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  Status Distribusi Lisensi
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  Proporsi lisensi aktif & kedaluwarsa
                </p>
              </div>
            </div>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              Total {overview.total_licenses}
            </span>
          </div>

          {/* Donut Body */}
          <div className="relative my-2 flex min-h-[200px] w-full items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height={200}>
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
                              Jumlah:{" "}
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
                    innerRadius={55}
                    outerRadius={78}
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
              <div className="h-44 w-44 rounded-full border-4 border-muted animate-pulse" />
            )}

            {/* Inner Total Pill */}
            <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-foreground">
                {overview.active_licenses}
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground">
                Aktif
              </span>
            </div>
          </div>

          {/* Legend Pills */}
          <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-3 text-center">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2">
              <span className="block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Sehat
              </span>
              <span className="text-xs font-black text-foreground">
                {healthyActiveCount}
              </span>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2">
              <span className="block text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                Akan Habis
              </span>
              <span className="text-xs font-black text-foreground">
                {expiringCount}
              </span>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-2">
              <span className="block text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                Kedaluwarsa
              </span>
              <span className="text-xs font-black text-foreground">
                {expiredCount}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Chart 2: Analitik Keuangan & Volume Ekosistem (Bar) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="lg:col-span-7"
      >
        <Card className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-2xs">
          {/* Header with Switcher Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <BarChart3 size={15} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  {activeTab === "finance"
                    ? "Komparasi Finansial & Tagihan"
                    : "Volume Ekosistem Layanan"}
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  {activeTab === "finance"
                    ? "Arus pendapatan vs piutang berjalan"
                    : "Distribusi data entitas utama"}
                </p>
              </div>
            </div>

            {/* Toggle Tabs */}
            <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/60 p-0.5">
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
                Finansial
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
                Volume
              </button>
            </div>
          </div>

          {/* Bar Chart Area */}
          <div className="my-3 flex-1 min-h-[210px] w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height={210}>
                {activeTab === "finance" ? (
                  <BarChart
                    data={financialData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
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
                              <div className="mt-1 text-sm font-black text-primary">
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
                      radius={[8, 8, 0, 0]}
                      barSize={44}
                    >
                      {financialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <BarChart
                    data={volumeData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
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
                              <div className="mt-1 text-sm font-black text-foreground">
                                {data.value} data
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar
                      dataKey="jumlah"
                      radius={[8, 8, 0, 0]}
                      barSize={38}
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
          <div className="flex items-center justify-between border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5 truncate">
              <TrendingUp size={13} className="text-primary shrink-0" />
              <span className="truncate">
                {overview.unpaid_invoices_count > 0
                  ? `Ada ${overview.unpaid_invoices_count} invoice menunggu pelunasan`
                  : "Semua tagihan lunas terverifikasi"}
              </span>
            </div>
            <span className="shrink-0 font-bold text-foreground">
              {formatRupiah(overview.revenue_this_month)}
            </span>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
