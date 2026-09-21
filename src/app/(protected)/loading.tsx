import { PageLoader } from "@/components/feedback/page-loader"

export default function ProtectedLoading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <PageLoader message="Menyiapkan data dashboard..." />
    </div>
  )
}
