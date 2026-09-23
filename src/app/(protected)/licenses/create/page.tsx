import type { Metadata } from "next"
import { LicenseCreateView } from "@/features/licenses"

export const metadata: Metadata = {
  title: "Terbitkan Lisensi Baru | Portal Mitrasova",
  description: "Daftarkan instance lisensi klien, tentukan paket server, pilih add-on, dan terbitkan faktur awal.",
}

export default function LicenseCreatePage() {
  return <LicenseCreateView />
}
