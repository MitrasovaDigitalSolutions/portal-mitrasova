import type { Metadata } from "next"
import { CashflowView } from "@/features/cashflow"

export const metadata: Metadata = {
  title: "Arus Kas (Cashflow) | Portal Mitrasova",
  description: "Laporan likuiditas keuangan dan tren arus kas bulanan & harian",
}

export default function CashflowPage() {
  return <CashflowView />
}
