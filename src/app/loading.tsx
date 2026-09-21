import { PageLoader } from "@/components/feedback/page-loader"

export default function RootLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <PageLoader message="Memuat halaman..." />
    </div>
  )
}
