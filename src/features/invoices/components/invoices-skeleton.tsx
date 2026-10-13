"use client"

import type React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function InvoicesSkeleton(): React.JSX.Element {
  return (
    <div className="animate-in space-y-3.5 duration-200 fade-in sm:space-y-4">
      {/* Page Header skeleton */}
      <div className="space-y-1">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-3.5 w-80 rounded-lg" />
      </div>

      {/* Metric cards skeleton (1-col mobile, 3-col desktop) */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="space-y-2 rounded-xl border border-border bg-card p-3 sm:p-3.5"
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

      {/* Filter and toolbar skeleton (single-row flex) */}
      <div className="flex flex-col items-stretch justify-between gap-2.5 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <Skeleton className="h-9 w-full max-w-sm rounded-xl" />
          <Skeleton className="h-9 w-64 rounded-xl" />
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Skeleton className="h-9 w-20 rounded-xl" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border bg-muted/20 p-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-2 p-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-border/40 py-2 last:border-0"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-36" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-28" />
              <div className="flex gap-1.5">
                <Skeleton className="h-7 w-7 rounded-lg" />
                <Skeleton className="h-7 w-7 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
