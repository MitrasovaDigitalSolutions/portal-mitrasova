import type { Metadata } from "next"
import { InvoiceFormView } from "@/features/invoices"

export const metadata: Metadata = {
  title: "Edit Invoice | Portal Mitrasova",
  description: "Ubah rincian faktur tagihan dan pembayaran",
}

interface EditInvoicePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  const resolvedParams = await params
  return <InvoiceFormView invoiceId={resolvedParams.id} />
}
