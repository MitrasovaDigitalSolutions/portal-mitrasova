"use client"

import type React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function ClientsSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="space-y-1">
        <Skeleton className="h-6 w-40 rounded-lg" />
        <Skeleton className="h-3.5 w-64 rounded-md" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-3 sm:p-3.5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-20 rounded" />
              <Skeleton className="size-7 rounded-lg" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <Skeleton className="h-5 w-12 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex items-center justify-between gap-2.5">
        <Skeleton className="h-9 w-64 rounded-xl" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-border bg-card p-3.5 space-y-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
          >
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-7.5 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-32 rounded" />
                <Skeleton className="h-3 w-44 rounded" />
              </div>
            </div>
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
