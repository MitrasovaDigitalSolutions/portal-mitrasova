import type { JSX } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function LicenseDetailPageSkeleton(): JSX.Element {
  return (
    <div className="animate-pulse space-y-4">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
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
      <div className="flex h-9 w-fit items-center gap-1.5 rounded-lg border border-border/80 bg-muted/60 p-1">
        <Skeleton className="h-7 w-32 rounded-md" />
        <Skeleton className="h-7 w-28 rounded-md" />
        <Skeleton className="h-7 w-24 rounded-md" />
        <Skeleton className="h-7 w-24 rounded-md" />
      </div>

      {/* 3. Overview Card Skeleton (Tab 1) */}
      <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-44 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="space-y-2 rounded-lg border border-border/70 bg-muted/20 p-3"
            >
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Credentials Card Skeleton (Tab 1) */}
      <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-2.5">
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
          <div className="mt-1 space-y-1.5 rounded-lg border border-border/70 bg-muted/20 p-3">
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
