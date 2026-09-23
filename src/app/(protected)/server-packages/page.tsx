import type { Metadata } from "next"
import { ServerPackagesView } from "@/features/server-packages"

export const metadata: Metadata = {
  title: "Paket Server | Portal Mitrasova",
  description: "Kelola master data paket server hosting dan spesifikasi resource untuk lisensi klien.",
}

export default function ServerPackagesPage() {
  return <ServerPackagesView />
}
