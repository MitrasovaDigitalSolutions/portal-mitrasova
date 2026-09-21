import type { JSX } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function LicenseDetailPageSkeleton(): JSX.Element {
  return (
    <div className="space-y-4 animate-pulse">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border">
        <div className="space-y-2">
          {/* Breadcrumb back link */}
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 rounded" />
            <Skeleton className="h-3.5 w-32 rounded" />
          </div>
          {/* Instance title & badges */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <Skeleton className="h-7 w-52 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>

      {/* 2. Tabs Bar Skeleton */}
      <div className="h-9 p-1 rounded-lg bg-muted/60 border border-border/80 flex items-center gap-1.5 w-fit">
        <Skeleton className="h-7 w-32 rounded-md" />
        <Skeleton className="h-7 w-28 rounded-md" />
        <Skeleton className="h-7 w-24 rounded-md" />
        <Skeleton className="h-7 w-24 rounded-md" />
      </div>

      {/* 3. Overview Card Skeleton (Tab 1) */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-44 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-2"
            >
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Credentials Card Skeleton (Tab 1) */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-48 rounded" />
          </div>
        </div>

        <div className="space-y-3">
          {/* Key row */}
          <div className="space-y-1">
            <Skeleton className="h-3 w-28 rounded" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 flex-1 rounded-lg" />
              <Skeleton className="h-9 w-18 rounded-lg" />
            </div>
          </div>

          {/* Secret row */}
          <div className="space-y-1">
            <Skeleton className="h-3 w-32 rounded" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 flex-1 rounded-lg" />
              <Skeleton className="h-9 w-18 rounded-lg" />
            </div>
          </div>

          {/* Binding card */}
          <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1.5 mt-1">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            <Skeleton className="h-4 w-48 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
