import type { Metadata } from "next"
import { InvoicesView } from "@/features/invoices"

export const metadata: Metadata = {
  title: "Invoices | Portal Mitrasova",
  description: "Manajemen faktur tagihan dan pelunasan lisensi Portal Mitrasova",
}

export default function InvoicesPage() {
  return <InvoicesView />
}

