import type { Metadata } from "next"
import { ClientsView } from "@/features/clients"

export const metadata: Metadata = {
  title: "Klien & Pelanggan | Portal Mitrasova",
  description: "Manajemen data klien, mitra, dan integrasi lisensi software Portal Mitrasova",
}

export default function ClientsPage() {
  return <ClientsView />
}
