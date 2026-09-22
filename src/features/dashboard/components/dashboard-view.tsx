"use client"

import { useState } from "react"
import { AlertCircle, RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useDashboardMetrics } from "../api/dashboard.queries"
import { DashboardSkeleton } from "./dashboard-skeleton"
import { DashboardMetricsGrid } from "./dashboard-metrics-grid"
import { DashboardCharts } from "./dashboard-charts"
import { ExpiringLicensesTable } from "./expiring-licenses-table"

export function DashboardView() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useDashboardMetrics()

  const [isManualRefreshing, setIsManualRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsManualRefreshing(true)
    await refetch()
    setTimeout(() => setIsManualRefreshing(false), 500)
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-card p-8 text-center shadow-xs">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-destructive/25 bg-destructive/10 text-destructive">
          <AlertCircle size={24} />
        </div>
        <h3 className="text-sm font-bold text-foreground">
          Gagal Memuat Data Dashboard
        </h3>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Terjadi gangguan saat mengambil metrik dari server."}
        </p>
        <Button
          onClick={() => void refetch()}
          variant="outline"
          size="sm"
          className="mt-4 rounded-xl font-bold cursor-pointer"
        >
          <RotateCw size={14} className="mr-1.5" />
          Coba Lagi
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* ─── Compact Top Controls ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Executive Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Aktif
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pantau kinerja operasional, utilisasi lisensi, dan arus kas langganan secara real-time.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isFetching || isManualRefreshing}
          className="h-8.5 px-3 rounded-xl border-border bg-card text-xs font-semibold text-muted-foreground shadow-2xs hover:bg-muted hover:text-foreground cursor-pointer shrink-0 self-start sm:self-auto"
          title="Sinkronisasi ulang data metrik terkini"
        >
          <RotateCw
            size={12}
            className={`mr-1.5 ${
              isFetching || isManualRefreshing ? "animate-spin text-primary" : ""
            }`}
          />
          <span>Segarkan Data</span>
        </Button>
      </div>

      {/* ─── KPI Summary Cards Grid ───────────────────────────────────────────── */}
      <DashboardMetricsGrid overview={data.overview} />

      {/* ─── Interactive Charts Row (Recharts) ─────────────────────────────────── */}
      <DashboardCharts
        overview={data.overview}
        expiringSoon={data.expiring_soon}
      />

      {/* ─── Expiring Soon Licenses Table ─────────────────────────────────────── */}
      <ExpiringLicensesTable licenses={data.expiring_soon} />
    </div>
  )
}
