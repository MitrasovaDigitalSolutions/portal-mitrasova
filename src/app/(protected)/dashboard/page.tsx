import type { Metadata } from "next"
import { DashboardView } from "@/features/dashboard"

export const metadata: Metadata = {
  title: "Dashboard | Portal Mitrasova",
  description: "Ringkasan metrik dan operasional Portal Mitrasova",
}

export default function DashboardPage() {
  return <DashboardView />
}

