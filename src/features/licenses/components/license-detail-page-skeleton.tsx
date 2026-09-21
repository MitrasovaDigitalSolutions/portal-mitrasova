import type { JSX } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function LicenseDetailPageSkeleton(): JSX.Element {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-48 rounded" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-56 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>

      {/* Overview Card Skeleton */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <Skeleton className="h-4 w-40 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>
      </div>

      {/* Credentials Card Skeleton */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <Skeleton className="h-4 w-44 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </div>

      {/* Invoices Card Skeleton */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <Skeleton className="h-4 w-36 rounded" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    </div>
  )
}
