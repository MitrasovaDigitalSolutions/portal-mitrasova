import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Products | Portal Mitrasova",
  description: "Manajemen produk dan layanan Portal Mitrasova",
}

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
        <div className="max-w-md space-y-1.5">
          <h2 className="text-base font-semibold text-foreground">
            Halaman Products
          </h2>
          <p className="text-xs text-muted-foreground">
            Area katalog produk dan inventaris siap untuk dikembangkan.
          </p>
        </div>
      </div>
    </div>
  )
}
