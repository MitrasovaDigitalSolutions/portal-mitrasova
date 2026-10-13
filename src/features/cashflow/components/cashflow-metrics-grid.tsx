"use client"

import type { JSX } from "react"
import { ArrowDownLeft, ArrowUpRight, Scale, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatRupiah } from "@/hooks/use-format-rupiah"
import { cn } from "@/lib/utils"
import type { CashflowSummary } from "../@types/cashflow"

interface CashflowMetricsGridProps {
  summary: CashflowSummary | undefined
  isLoading?: boolean
}

export function CashflowMetricsGrid({
  summary,
  isLoading = false,
}: CashflowMetricsGridProps): JSX.Element {
  const totalInflow = summary?.total_inflow_month ?? 0
  const totalOutflow = summary?.total_outflow_month ?? 0
  const netCashflow = summary?.net_cashflow_month ?? 0
  const isSurplus = netCashflow >= 0
  const totalVolume = totalInflow + totalOutflow

  const inflowPercentage =
    totalVolume > 0 ? Math.round((totalInflow / totalVolume) * 100) : 50
  const outflowPercentage = totalVolume > 0 ? 100 - inflowPercentage : 50

  return (
    <div className="space-y-2.5">
      {/* ─── 4 Ringkasan Metrik Finansial Bersih ───────────────────────────── */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Saldo */}
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium">Total Saldo Kas</span>
            <Wallet size={15} />
          </div>
          <div className="mt-2 font-mono text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {isLoading ? "..." : formatRupiah(summary?.total_balance ?? 0)}
          </div>
        </div>

        {/* Kas Masuk */}
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-[11px] font-medium text-muted-foreground">
              Kas Masuk (Inflow)
            </span>
            <ArrowDownLeft size={15} />
          </div>
          <div className="mt-2 font-mono text-lg font-bold tracking-tight text-emerald-600 sm:text-xl dark:text-emerald-400">
            {isLoading ? "..." : formatRupiah(totalInflow)}
          </div>
        </div>

        {/* Kas Keluar */}
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
            <span className="text-[11px] font-medium text-muted-foreground">
              Kas Keluar (Outflow)
            </span>
            <ArrowUpRight size={15} />
          </div>
          <div className="mt-2 font-mono text-lg font-bold tracking-tight text-rose-600 sm:text-xl dark:text-rose-400">
            {isLoading ? "..." : formatRupiah(totalOutflow)}
          </div>
        </div>

        {/* Net Cashflow */}
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">
              Arus Kas Bersih (Net)
            </span>
            <Badge
              variant={isSurplus ? "secondary" : "destructive"}
              className={cn(
                "h-4 px-1 text-[8.5px] font-bold uppercase",
                isSurplus &&
                  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              )}
            >
              {isSurplus ? "Surplus" : "Defisit"}
            </Badge>
          </div>
          <div
            className={cn(
              "mt-2 font-mono text-lg font-bold tracking-tight sm:text-xl",
              isSurplus
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            )}
          >
            {isLoading ? "..." : formatRupiah(netCashflow)}
          </div>
        </div>
      </div>

      {/* ─── Rasio Kas Masuk vs Kas Keluar Bersih ─────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-3 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Scale size={13} />
            <span>Rasio Bulan Ini</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-emerald-600 dark:text-emerald-400">
              Masuk: {inflowPercentage}%
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="text-rose-600 dark:text-rose-400">
              Keluar: {outflowPercentage}%
            </span>
          </div>
        </div>

        <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            style={{ width: `${inflowPercentage}%` }}
            className="bg-emerald-500 transition-all"
          />
          <div
            style={{ width: `${outflowPercentage}%` }}
            className="bg-rose-500 transition-all"
          />
        </div>
      </div>
    </div>
  )
}
