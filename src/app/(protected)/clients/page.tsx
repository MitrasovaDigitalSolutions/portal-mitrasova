import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Clients | Portal Mitrasova",
  description: "Manajemen klien dan pelanggan Portal Mitrasova",
}

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
        <div className="max-w-md space-y-1.5">
          <h2 className="text-base font-semibold text-foreground">
            Halaman Clients
          </h2>
          <p className="text-xs text-muted-foreground">
            Area data klien dan mitra siap untuk dikembangkan.
          </p>
        </div>
      </div>
    </div>
  )
}
