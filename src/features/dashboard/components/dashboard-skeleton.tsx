"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Compact Top Controls Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="h-3 w-48 rounded-md" />
        </div>
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>

      {/* KPI Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4 flex flex-col justify-between gap-3 shadow-xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-7 w-32 rounded-lg" />
              <Skeleton className="h-3.5 w-20 rounded-md" />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="p-5 lg:col-span-5 flex flex-col justify-between gap-4 shadow-xs">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
          <div className="flex items-center justify-center py-6">
            <Skeleton className="h-44 w-44 rounded-full" />
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-border pt-3">
            <Skeleton className="h-8 rounded-lg" />
            <Skeleton className="h-8 rounded-lg" />
            <Skeleton className="h-8 rounded-lg" />
          </div>
        </Card>

        <Card className="p-5 lg:col-span-7 flex flex-col justify-between gap-4 shadow-xs">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
          <div className="h-56 w-full flex items-end gap-3 px-4 py-2">
            <Skeleton className="h-32 flex-1 rounded-t-lg" />
            <Skeleton className="h-44 flex-1 rounded-t-lg" />
            <Skeleton className="h-28 flex-1 rounded-t-lg" />
            <Skeleton className="h-48 flex-1 rounded-t-lg" />
          </div>
        </Card>
      </div>

      {/* Expiring Soon Table Skeleton */}
      <Card className="p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-52 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-3 w-28 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
