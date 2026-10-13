"use client"

import { useEffect, useMemo, useState, type JSX } from "react"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { FilterX, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FormDateRangePicker } from "@/components/forms"
import { formatRupiah } from "@/hooks/use-format-rupiah"
import { cn } from "@/lib/utils"
import type {
  CashflowTrendParams,
  CashflowTrendPoint,
} from "../@types/cashflow"

const trendDateFilterSchema = z.object({
  date_from: z.string().optional(),
  date_to: z.string().optional(),
})

type TrendDateFilterValues = z.infer<typeof trendDateFilterSchema>

interface CashflowTrendChartProps {
  data: CashflowTrendPoint[] | undefined
  isLoading?: boolean
  params: CashflowTrendParams
  onParamsChange: (newParams: CashflowTrendParams) => void
}

export function CashflowTrendChart({
  data = [],
  isLoading = false,
  params,
  onParamsChange,
}: CashflowTrendChartProps): JSX.Element {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const methods = useForm<TrendDateFilterValues>({
    resolver: zodResolver(trendDateFilterSchema),
    defaultValues: {
      date_from: params.date_from ?? "",
      date_to: params.date_to ?? "",
    },
  })

  const watchedDateFrom = useWatch({
    control: methods.control,
    name: "date_from",
  })
  const watchedDateTo = useWatch({
    control: methods.control,
    name: "date_to",
  })

  // Sinkronkan perubahan form ke params parent
  useEffect(() => {
    const nextDateFrom = watchedDateFrom?.trim() || undefined
    const nextDateTo = watchedDateTo?.trim() || undefined

    if (nextDateFrom !== params.date_from || nextDateTo !== params.date_to) {
      onParamsChange({
        ...params,
        date_from: nextDateFrom,
        date_to: nextDateTo,
      })
    }
  }, [watchedDateFrom, watchedDateTo, params, onParamsChange])

  // Sinkronkan form jika params berubah dari luar (misal: saat reset)
  useEffect(() => {
    const currentFrom = methods.getValues("date_from") ?? ""
    const currentTo = methods.getValues("date_to") ?? ""
    const targetFrom = params.date_from ?? ""
    const targetTo = params.date_to ?? ""

    if (currentFrom !== targetFrom || currentTo !== targetTo) {
      methods.reset({
        date_from: targetFrom,
        date_to: targetTo,
      })
    }
  }, [params.date_from, params.date_to, methods])

  const handleGroupByChange = (groupBy: "date" | "month") => {
    onParamsChange({
      ...params,
      group_by: groupBy,
    })
  }

  const handleResetFilter = () => {
    methods.reset({
      date_from: "",
      date_to: "",
    })
    onParamsChange({
      group_by: "month",
      date_from: undefined,
      date_to: undefined,
    })
  }

  const stats = useMemo(() => {
    const totalInflow = data.reduce((acc, curr) => acc + curr.inflow, 0)
    const totalOutflow = data.reduce((acc, curr) => acc + curr.outflow, 0)
    const net = totalInflow - totalOutflow
    return { totalInflow, totalOutflow, net }
  }, [data])

  const hasFilter = Boolean(
    params.date_from || params.date_to || params.group_by === "date"
  )

  return (
    <Card className="rounded-xl border border-border bg-card p-4 shadow-2xs">
      {/* ─── Header & Controls ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5 border-b border-border/60 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={15} className="text-primary" />
          <h3 className="text-xs font-bold text-foreground">
            Tren Arus Kas (Inflow vs Outflow)
          </h3>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Control */}
          <div className="inline-flex rounded-lg border border-border bg-muted/60 p-0.5">
            <Button
              type="button"
              variant={params.group_by === "date" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleGroupByChange("date")}
              className="h-7 cursor-pointer px-2.5 text-xs font-semibold"
            >
              Harian
            </Button>
            <Button
              type="button"
              variant={params.group_by !== "date" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleGroupByChange("month")}
              className="h-7 cursor-pointer px-2.5 text-xs font-semibold"
            >
              Bulanan
            </Button>
          </div>

          {/* Date Range Reusable FormDateRangePicker */}
          <FormProvider {...methods}>
            <FormDateRangePicker<TrendDateFilterValues>
              fromName="date_from"
              toName="date_to"
              fromPlaceholder="Dari tgl..."
              toPlaceholder="Sampai tgl..."
              size="sm"
              itemClassName="w-34 sm:w-38"
            />
          </FormProvider>

          {hasFilter && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetFilter}
              className="h-7.5 cursor-pointer px-2 text-xs text-muted-foreground hover:text-foreground"
              title="Reset filter periode"
            >
              <FilterX className="mr-1 size-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* ─── Ringkasan 3 Angka Bersih ──────────────────────────────────────── */}
      <div className="my-2.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-xs">
        <div>
          <span className="text-[10px] text-muted-foreground">Masuk:</span>{" "}
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {formatRupiah(stats.totalInflow)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground">Keluar:</span>{" "}
          <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
            {formatRupiah(stats.totalOutflow)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground">Selisih:</span>{" "}
          <span
            className={cn(
              "font-mono font-bold",
              stats.net >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            )}
          >
            {formatRupiah(stats.net)}
          </span>
        </div>
      </div>

      {/* ─── Recharts Canvas ──────────────────────────────────────────────── */}
      <div className="mt-1 min-h-[260px] w-full">
        {isLoading || !mounted ? (
          <div className="flex h-[260px] items-center justify-center">
            <div className="h-56 w-full animate-pulse rounded-xl border border-muted bg-muted/20" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-[260px] flex-col items-center justify-center text-center text-muted-foreground">
            <TrendingUp className="size-8 stroke-1 text-muted-foreground/40" />
            <p className="mt-2 text-xs">
              Belum ada data transaksi pada rentang ini.
            </p>
          </div>
        ) : (
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 12, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.15}
                  vertical={false}
                />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  stroke="#888888"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  stroke="#888888"
                  tickFormatter={(val: number) => {
                    if (val >= 1_000_000) {
                      return `${(val / 1_000_000).toFixed(0)}Jt`
                    }
                    if (val >= 1_000) {
                      return `${(val / 1_000).toFixed(0)}Rb`
                    }
                    return `${val}`
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const inflowVal =
                        (payload.find((p) => p.dataKey === "inflow")
                          ?.value as number) ?? 0
                      const outflowVal =
                        (payload.find((p) => p.dataKey === "outflow")
                          ?.value as number) ?? 0
                      const netVal = inflowVal - outflowVal
                      return (
                        <div className="min-w-[170px] rounded-xl border border-border bg-popover p-2.5 text-xs shadow-md">
                          <p className="font-mono text-[11px] font-bold text-popover-foreground">
                            {label}
                          </p>
                          <div className="mt-1.5 space-y-1 border-t border-border/50 pt-1.5 text-[11px]">
                            <div className="flex items-center justify-between">
                              <span className="text-emerald-600 dark:text-emerald-400">
                                Masuk:
                              </span>
                              <span className="font-mono font-semibold text-foreground">
                                {formatRupiah(inflowVal)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-rose-600 dark:text-rose-400">
                                Keluar:
                              </span>
                              <span className="font-mono font-semibold text-foreground">
                                {formatRupiah(outflowVal)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-t border-border/40 pt-1 font-bold">
                              <span className="text-muted-foreground">
                                Selisih:
                              </span>
                              <span
                                className={cn(
                                  "font-mono",
                                  netVal >= 0
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-rose-600 dark:text-rose-400"
                                )}
                              >
                                {formatRupiah(netVal)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={24}
                  iconSize={7}
                  wrapperStyle={{ fontSize: "10px", paddingBottom: "4px" }}
                />
                <Bar
                  dataKey="inflow"
                  name="Masuk"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="outflow"
                  name="Keluar"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  )
}
