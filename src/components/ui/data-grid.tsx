"use client"

import * as React from "react"
import {
  flexRender,
  type Row,
  type Table as TanstackTable,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"

interface DataGridProps<TData> {
  table: TanstackTable<TData>
  isLoading?: boolean
  emptyMessage?: string
  gridClassName?: string
  renderCardItem?: (row: Row<TData>) => React.ReactNode
}

export function DataGrid<TData>({
  table,
  isLoading = false,
  emptyMessage = "Tidak ada data ditemukan.",
  gridClassName,
  renderCardItem,
}: DataGridProps<TData>) {
  const { rows } = table.getRowModel()
  const visibleColumns = table.getVisibleFlatColumns()

  const contentColumns = visibleColumns.filter(
    (col) => col.id !== "rowNumber" && col.id !== "actions"
  )

  const titleColumn = contentColumns[0]
  const detailColumns = contentColumns.slice(1)
  const actionColumn = visibleColumns.find((col) => col.id === "actions")

  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-3.5 p-3.5 sm:grid-cols-2 lg:grid-cols-2",
          gridClassName
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse space-y-3 rounded-2xl border border-border bg-card p-4 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-1/2 rounded-md bg-muted" />
              <div className="h-6 w-16 rounded-lg bg-muted" />
            </div>
            <div className="space-y-2 border-t border-border pt-2">
              <div className="h-3 w-3/4 rounded-md bg-muted" />
              <div className="h-3 w-2/3 rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-xs font-medium text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3.5 p-3.5 sm:grid-cols-2 lg:grid-cols-2",
        gridClassName
      )}
    >
      {rows.map((row) => {
        if (renderCardItem) {
          return (
            <React.Fragment key={row.id}>{renderCardItem(row)}</React.Fragment>
          )
        }

        const visibleCells = row.getVisibleCells()
        const titleCell = titleColumn
          ? visibleCells.find((c) => c.column.id === titleColumn.id)
          : null
        const actionCell = actionColumn
          ? visibleCells.find((c) => c.column.id === actionColumn.id)
          : null

        return (
          <div
            key={row.id}
            className="group flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-2xs transition-all hover:border-ring/50 hover:shadow-md"
          >
            {/* Header Row: Main Identifier & Action Buttons */}
            <div className="flex items-start justify-between gap-2 border-b border-border pb-2.5">
              <div className="min-w-0 flex-1">
                {titleCell ? (
                  <div className="text-xs leading-snug font-bold break-words text-foreground sm:text-sm">
                    {flexRender(
                      titleCell.column.columnDef.cell,
                      titleCell.getContext()
                    )}
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-muted-foreground">
                    Item #{row.index + 1}
                  </span>
                )}
              </div>

              {actionCell && (
                <div className="flex shrink-0 items-center gap-1">
                  {flexRender(
                    actionCell.column.columnDef.cell,
                    actionCell.getContext()
                  )}
                </div>
              )}
            </div>

            {/* Card Body: Details Grid */}
            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              {detailColumns.map((col) => {
                const cell = visibleCells.find((c) => c.column.id === col.id)
                if (!cell) {
                  return null
                }

                const headerText =
                  typeof col.columnDef.header === "string"
                    ? col.columnDef.header
                    : col.id

                return (
                  <div
                    key={col.id}
                    className="flex min-w-0 flex-col gap-0.5 rounded-xl border border-border bg-muted/40 p-2"
                  >
                    <span className="truncate text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
                      {headerText}
                    </span>
                    <div className="truncate text-xs font-semibold text-foreground">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
