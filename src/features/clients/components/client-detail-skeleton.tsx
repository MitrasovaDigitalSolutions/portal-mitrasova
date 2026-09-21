"use client"

import type React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function ClientDetailSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-3.5 animate-pulse">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-border gap-3">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-3.5 rounded" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-md hidden md:inline-flex" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <Skeleton className="h-8 w-18 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-18 rounded-lg" />
        </div>
      </div>

      {/* 2. Compact Profile & Metrics Card Skeleton */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {/* Profile Contacts Row */}
        <div className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
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
        <div className="border-t border-border/70 bg-muted/15 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-3 sm:px-4 flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
              <div className="space-y-1 min-w-0">
                <Skeleton className="h-5 w-10 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-2.5 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Licenses Section Skeleton */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3.5">
        {/* Toolbar Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
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
