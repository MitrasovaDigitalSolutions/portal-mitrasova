import type { Metadata } from "next"
import { LicensesView } from "@/features/licenses"

export const metadata: Metadata = {
  title: "Lisensi Software | Portal Mitrasova",
  description: "Daftar lisensi instance software terdaftar, kontrol status aktivasi, dan monitoring server.",
}

export default function LicensesPage() {
  return <LicensesView />
}
