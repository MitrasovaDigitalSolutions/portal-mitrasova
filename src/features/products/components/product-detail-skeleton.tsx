"use client"

import type React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductDetailSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-8.5 w-8.5 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-8.5 w-20 rounded-xl" />
          <Skeleton className="h-8.5 w-24 rounded-xl" />
          <Skeleton className="h-8.5 w-16 rounded-xl" />
        </div>
      </div>

      {/* Metric Cards Skeleton (2-col mobile, 4-col desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-3 sm:p-3.5 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Addons Section Skeleton */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8.5 w-56 rounded-xl" />
        </div>
        <div className="rounded-xl border border-border bg-card p-3 space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
            >
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
