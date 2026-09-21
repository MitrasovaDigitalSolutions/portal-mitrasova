import type { Metadata } from "next"
import { InvoiceFormView } from "@/features/invoices"

export const metadata: Metadata = {
  title: "Buat Invoice Baru | Portal Mitrasova",
  description: "Terbitkan faktur tagihan dan lisensi baru untuk pelanggan",
}

export default function CreateInvoicePage() {
  return <InvoiceFormView />
}
