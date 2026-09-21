import type { Metadata } from "next"
import { LicenseDetailView } from "@/features/licenses"

export const metadata: Metadata = {
  title: "Detail Lisensi | Portal Mitrasova",
  description: "Inspeksi rincian lisensi software, kredensial secret, modul addon, dan riwayat tagihan invoice",
}

interface LicenseDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function LicenseDetailPage({
  params,
}: LicenseDetailPageProps) {
  const resolvedParams = await params
  return <LicenseDetailView licenseId={resolvedParams.id} />
}
