import type { Metadata } from "next"
import { ClientDetailView } from "@/features/clients"

export const metadata: Metadata = {
  title: "Detail Klien & Manajemen Lisensi | Portal Mitrasova",
  description: "Profil lengkap klien, integrasi lisensi instance, dan modul addon Portal Mitrasova",
}

interface ClientDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const resolvedParams = await params
  return <ClientDetailView clientId={resolvedParams.id} />
}
