"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-3.5 sm:space-y-4 animate-in fade-in duration-250">
      {/* Compact Top Controls Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-44 rounded-lg" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-3.5 w-64 rounded-md" />
        </div>
        <Skeleton className="h-8.5 w-28 rounded-xl" />
      </div>

      {/* KPI Cards Grid Skeleton (2-col mobile, 4-col desktop) */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-3.5 rounded-xl flex flex-col justify-between gap-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-28 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-6 w-32 rounded-md" />
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-border/40">
              <Skeleton className="h-2.5 w-24 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 gap-2.5 sm:gap-3 lg:grid-cols-12">
        <Card className="p-3.5 sm:p-4 lg:col-span-5 rounded-xl flex flex-col justify-between gap-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <div className="flex items-center justify-center py-4">
            <Skeleton className="h-36 w-36 rounded-full" />
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-border/60">
            <Skeleton className="h-7 rounded-lg" />
            <Skeleton className="h-7 rounded-lg" />
            <Skeleton className="h-7 rounded-lg" />
          </div>
        </Card>

        <Card className="p-3.5 sm:p-4 lg:col-span-7 rounded-xl flex flex-col justify-between gap-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <Skeleton className="h-4 w-44 rounded-md" />
            <Skeleton className="h-6 w-32 rounded-xl" />
          </div>
          <div className="h-40 w-full flex items-end gap-3 px-4 py-2">
            <Skeleton className="h-24 flex-1 rounded-t-lg" />
            <Skeleton className="h-32 flex-1 rounded-t-lg" />
            <Skeleton className="h-20 flex-1 rounded-t-lg" />
            <Skeleton className="h-36 flex-1 rounded-t-lg" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <Skeleton className="h-3 w-40 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
        </Card>
      </div>

      {/* Expiring Table Skeleton */}
      <Card className="p-3.5 sm:p-4 rounded-xl shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <Skeleton className="h-4 w-48 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="space-y-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-muted/20"
            >
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-6 w-6 rounded-md" />
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-32 rounded-md" />
                  <Skeleton className="h-2.5 w-20 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
