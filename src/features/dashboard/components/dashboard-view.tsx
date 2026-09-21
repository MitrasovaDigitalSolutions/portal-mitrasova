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

  // Indonesian Date
  const todayFormatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date())

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
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-foreground sm:text-base">
            Ringkasan Metrik
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Data operasional dan status lisensi terkini
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isFetching || isManualRefreshing}
          className="h-8 rounded-xl border-border bg-card text-xs font-bold text-muted-foreground shadow-2xs hover:bg-muted hover:text-foreground cursor-pointer"
        >
          <RotateCw
            size={12}
            className={`mr-1.5 ${
              isFetching || isManualRefreshing ? "animate-spin text-primary" : ""
            }`}
          />
          <span>Segarkan</span>
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
