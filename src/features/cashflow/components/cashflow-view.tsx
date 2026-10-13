"use client"

import { useState, type JSX } from "react"
import { Calendar, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCashflowSummary, useCashflowTrend } from "../api/cashflow.queries"
import { CashflowMetricsGrid } from "./cashflow-metrics-grid"
import { CashflowTrendChart } from "./cashflow-trend-chart"
import type { CashflowTrendParams } from "../@types/cashflow"

function getCurrentMonthString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

function shiftMonth(monthStr: string, offset: number): string {
  const [yearStr, monthNumStr] = monthStr.split("-")
  const year = Number(yearStr)
  const month = Number(monthNumStr) - 1
  const date = new Date(year, month + offset, 1)
  const newYear = date.getFullYear()
  const newMonth = String(date.getMonth() + 1).padStart(2, "0")
  return `${newYear}-${newMonth}`
}

export function CashflowView(): JSX.Element {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    getCurrentMonthString()
  )
  const [trendParams, setTrendParams] = useState<CashflowTrendParams>({
    group_by: "month",
  })

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isRefetching: isSummaryRefetching,
    refetch: refetchSummary,
  } = useCashflowSummary(selectedMonth)

  const {
    data: trendData,
    isLoading: isTrendLoading,
    isRefetching: isTrendRefetching,
    refetch: refetchTrend,
  } = useCashflowTrend(trendParams)

  const isBusy =
    isSummaryLoading ||
    isTrendLoading ||
    isSummaryRefetching ||
    isTrendRefetching

  const handleRefresh = () => {
    void refetchSummary()
    void refetchTrend()
  }

  const handlePrevMonth = () => {
    setSelectedMonth((prev) => shiftMonth(prev, -1))
  }

  const handleNextMonth = () => {
    setSelectedMonth((prev) => shiftMonth(prev, 1))
  }

  return (
    <div className="space-y-3">
      {/* ─── Toolbar Kontrol Bulan Ringkas ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-2xs">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="size-7 cursor-pointer rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Bulan Sebelumnya"
          >
            <ChevronLeft size={14} />
          </Button>

          <div className="flex items-center gap-2 px-2.5">
            <Calendar className="size-3.5 shrink-0 text-primary" />
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="h-7 w-48 cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-foreground focus-visible:ring-0 sm:w-56"
              aria-label="Pilih Bulan Arus Kas"
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="size-7 cursor-pointer rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Bulan Berikutnya"
          >
            <ChevronRight size={14} />
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isBusy}
          className="h-8.5 cursor-pointer rounded-xl border-border px-3 text-xs font-medium shadow-2xs hover:bg-muted"
        >
          <RefreshCw
            size={13}
            className={`mr-1.5 ${isBusy ? "animate-spin text-primary" : "text-muted-foreground"}`}
          />
          Muat Ulang
        </Button>
      </div>

      {/* ─── Ringkasan 4 Kartu Metrik ───────────────────────────────────────── */}
      <CashflowMetricsGrid summary={summary} isLoading={isSummaryLoading} />

      {/* ─── Grafik Tren Recharts Simpel ────────────────────────────────────── */}
      <CashflowTrendChart
        data={trendData}
        isLoading={isTrendLoading}
        params={trendParams}
        onParamsChange={setTrendParams}
      />
    </div>
  )
}
