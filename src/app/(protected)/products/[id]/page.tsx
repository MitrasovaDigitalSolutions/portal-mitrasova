import type { Metadata } from "next"
import { ProductDetailView } from "@/features/products"

export const metadata: Metadata = {
  title: "Detail Produk & Modul Addon | Portal Mitrasova",
  description: "Detail informasi produk software dan manajemen modul addon",
}

interface ProductDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const resolvedParams = await params
  return <ProductDetailView productId={resolvedParams.id} />
}
