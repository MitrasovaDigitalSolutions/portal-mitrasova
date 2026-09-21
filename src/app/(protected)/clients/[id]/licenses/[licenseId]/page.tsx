import type { Metadata } from "next"
import { LicenseDetailView } from "@/features/licenses"

export const metadata: Metadata = {
  title: "Detail Lisensi | Portal Mitrasova",
  description: "Inspeksi rincian lisensi software, kredensial secret, modul addon, dan riwayat tagihan invoice",
}

interface ClientLicenseDetailPageProps {
  params: Promise<{
    id: string
    licenseId: string
  }>
}

export default async function ClientLicenseDetailPage({
  params,
}: ClientLicenseDetailPageProps) {
  const resolvedParams = await params
  return (
    <LicenseDetailView
      clientId={resolvedParams.id}
      licenseId={resolvedParams.licenseId}
    />
  )
}
