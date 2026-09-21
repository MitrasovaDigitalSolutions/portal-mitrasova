import type { Metadata } from "next"
import { ProductsView } from "@/features/products"

export const metadata: Metadata = {
  title: "Produk Software | Portal Mitrasova",
  description: "Manajemen katalog produk software dan modul addon Portal Mitrasova",
}

export default function ProductsPage() {
  return <ProductsView />
}
