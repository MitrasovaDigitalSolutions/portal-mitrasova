"use client"

import type React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function InvoicesSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-3.5 sm:space-y-4 animate-in fade-in duration-200">
      {/* Page Header skeleton */}
      <div className="space-y-1">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-3.5 w-80 rounded-lg" />
      </div>

      {/* Metric cards skeleton (2-col mobile, 4-col desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-3 sm:p-3.5 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
            <div className="space-y-1 pt-1">
              <Skeleton className="h-6 w-28 rounded-md" />
              <Skeleton className="h-2.5 w-32 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Filter and toolbar skeleton (single-row flex) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Skeleton className="h-9 w-full max-w-sm rounded-xl" />
          <Skeleton className="h-9 w-64 rounded-xl" />
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Skeleton className="h-9 w-20 rounded-xl" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="p-3 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
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
