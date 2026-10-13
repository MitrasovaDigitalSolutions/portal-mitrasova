import type { Metadata } from "next"
import { ExpensesView } from "@/features/expenses"

export const metadata: Metadata = {
  title: "Pengeluaran Kas | Portal Mitrasova",
  description:
    "Catat dan kelola pengeluaran operasional kas, beban biaya, dan struk bukti pembayaran.",
}

export default function ExpensesPage() {
  return <ExpensesView />
}
