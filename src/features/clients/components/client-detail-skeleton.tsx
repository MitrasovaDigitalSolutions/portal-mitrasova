"use client"

import type React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function ClientDetailSkeleton(): React.JSX.Element {
  return (
    <div className="animate-pulse space-y-3.5">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-3.5 rounded" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="hidden h-5 w-24 rounded-md md:inline-flex" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <Skeleton className="h-8 w-18 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-18 rounded-lg" />
        </div>
      </div>

      {/* 2. Compact Profile & Metrics Card Skeleton */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        {/* Profile Contacts Row */}
        <div className="flex flex-col justify-between gap-3 p-3.5 sm:p-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-3 w-28 rounded" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-7 w-36 rounded-lg" />
            <Skeleton className="h-7 w-28 rounded-lg" />
            <Skeleton className="h-7 w-44 rounded-lg" />
          </div>
        </div>

        {/* 4-Column Metric Ribbon */}
        <div className="grid grid-cols-2 divide-y divide-border/60 border-t border-border/70 bg-muted/15 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 sm:px-4">
              <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
              <div className="min-w-0 space-y-1">
                <Skeleton className="h-5 w-10 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-2.5 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Licenses Section Skeleton */}
      <div className="space-y-3.5 rounded-xl border border-border bg-card p-4 shadow-xs">
        {/* Toolbar Skeleton */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-44 rounded" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
            <Skeleton className="h-8 w-36 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        </div>

        {/* Table Rows Skeleton */}
        <div className="space-y-2 pt-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
