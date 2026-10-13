import type { Metadata } from "next"
import { CashAccountsView } from "@/features/cash-accounts"

export const metadata: Metadata = {
  title: "Akun Kas & Transfer | Portal Mitrasova",
  description:
    "Kelola multi-rekening kas, saldo operasional, mutasi debit/kredit manual, dan transfer antar akun.",
}

export default function CashAccountsPage() {
  return <CashAccountsView />
}
