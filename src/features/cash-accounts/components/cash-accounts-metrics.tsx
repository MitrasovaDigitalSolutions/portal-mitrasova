"use client"

import type { JSX } from "react"
import { CheckCircle2, Landmark, Star, Wallet } from "lucide-react"
import {
  MetricCards,
  type MetricCardItem,
} from "@/components/shared/metric-cards"
import { formatCurrency } from "@/utils"
import { useCashAccountStats } from "../hooks/use-cash-account-stats"

export function CashAccountsMetrics(): JSX.Element {
  const { stats } = useCashAccountStats()

  const items: MetricCardItem[] = [
    {
      title: "Total Saldo Kas",
      value: formatCurrency(stats.totalBalance),
      description: "Akumulasi saldo akun kas aktif",
      icon: Wallet,
      tone: "emerald",
    },
    {
      title: "Akun Default",
      value: stats.defaultAccountName ?? "Belum Diatur",
      description: "Tujuan otomatis pembayaran invoice",
      icon: Star,
      tone: "amber",
    },
    {
      title: "Akun Aktif",
      value: `${stats.activeCount} Akun`,
      description: "Dapat menerima & mengirim transaksi",
      icon: CheckCircle2,
      tone: "sky",
    },
    {
      title: "Total Akun",
      value: `${stats.totalCount} Akun`,
      description: "Semua akun kas terdaftar",
      icon: Landmark,
      tone: "primary",
    },
  ]

  return <MetricCards items={items} columns={4} />
}
