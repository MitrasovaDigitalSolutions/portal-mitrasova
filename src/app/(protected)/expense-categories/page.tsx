import type { Metadata } from "next"
import { ExpenseCategoriesView } from "@/features/expense-categories"

export const metadata: Metadata = {
  title: "Kategori Pengeluaran | Portal Mitrasova",
  description: "Kelola pos dan kategori pengeluaran kas operasional sistem.",
}

export default function ExpenseCategoriesPage() {
  return <ExpenseCategoriesView />
}
