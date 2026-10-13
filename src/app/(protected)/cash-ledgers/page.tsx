import type { Metadata } from "next"
import { CashLedgersView } from "@/features/cash-ledgers"

export const metadata: Metadata = {
  title: "Buku Kas & Mutasi | Portal Mitrasova",
  description:
    "Riwayat mutasi kredit dan debit buku kas multi-rekening operasional sistem.",
}

export default function CashLedgersPage() {
  return <CashLedgersView />
}
