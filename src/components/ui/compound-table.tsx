"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// ==========================================
// 1. ROOT CONTAINER (CARD + TITLE)
// ==========================================
export interface CompoundTableProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title?: React.ReactNode
}

export function CompoundTable({
  title,
  className,
  children,
  ...props
}: CompoundTableProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-2xl border-border bg-card p-6 shadow-xs",
        className
      )}
      {...props}
    >
      {title &&
        (typeof title === "string" ? (
          <h4 className="mb-4 text-xs font-bold text-foreground">{title}</h4>
        ) : (
          title
        ))}
      {children}
    </Card>
  )
}

// ==========================================
// 2. INNER TABLE SCROLLABLE CONTAINER
// ==========================================
export interface CompoundTableContentProps extends React.HTMLAttributes<HTMLDivElement> {
  tableClassName?: string
}

export function CompoundTableContent({
  children,
  className,
  tableClassName,
  ...props
}: CompoundTableContentProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
      {...props}
    >
      <Table className={tableClassName}>{children}</Table>
    </div>
  )
}

// ==========================================
// 3. TABLE HEADER ROW WRAPPER
// ==========================================
export interface CompoundTableHeaderProps extends React.ComponentPropsWithoutRef<
  typeof TableHeader
> {
  rowClassName?: string
}

export function CompoundTableHeader({
  children,
  className,
  rowClassName,
  ...props
}: CompoundTableHeaderProps) {
  return (
    <TableHeader
      className={cn(
        "sticky top-0 z-20 bg-muted/50 shadow-[0_1px_0_0_var(--border)]",
        className
      )}
      {...props}
    >
      <TableRow
        className={cn(
          "border-b border-border bg-muted/50 hover:bg-transparent",
          rowClassName
        )}
      >
        {children}
      </TableRow>
    </TableHeader>
  )
}

// ==========================================
// 4. SORTABLE & ALIGNED COLUMN HEADER
// ==========================================
export interface CompoundTableHeadProps extends React.ComponentPropsWithoutRef<
  typeof TableHead
> {
  align?: "left" | "center" | "right"
  sortKey?: string
  activeSortKey?: string | null
  sortDirection?: "asc" | "desc" | null
  onSort?: (key: string) => void
}

export function CompoundTableHead({
  children,
  className,
  align = "left",
  sortKey,
  activeSortKey,
  sortDirection,
  onSort,
  onClick,
  ...props
}: CompoundTableHeadProps) {
  const isSortable = !!sortKey && !!onSort
  const isActive = isSortable && activeSortKey === sortKey

  const handleSortClick = (e: React.MouseEvent<HTMLTableCellElement>) => {
    if (isSortable && sortKey) {
      onSort(sortKey)
    }
    if (onClick) {
      onClick(e)
    }
  }

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  const flexAlignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }

  return (
    <TableHead
      className={cn(
        "bg-muted/50 py-3 text-[10px] font-bold tracking-wider text-muted-foreground uppercase",
        isSortable &&
          "cursor-pointer transition-colors select-none hover:text-foreground",
        alignClasses[align],
        className
      )}
      onClick={handleSortClick}
      {...props}
    >
      {isSortable ? (
        <div
          className={cn("flex items-center gap-1.5", flexAlignClasses[align])}
        >
          <span>{children}</span>
          <span className="shrink-0 text-muted-foreground">
            {isActive ? (
              sortDirection === "asc" ? (
                <ArrowUp className="h-3 w-3 font-bold text-primary" />
              ) : (
                <ArrowDown className="h-3 w-3 font-bold text-primary" />
              )
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40 hover:opacity-100" />
            )}
          </span>
        </div>
      ) : (
        children
      )}
    </TableHead>
  )
}

// ==========================================
// 5. LOADING & EMPTY HANDLER BODY
// ==========================================
export interface CompoundTableBodyProps extends React.ComponentPropsWithoutRef<
  typeof TableBody
> {
  isLoading?: boolean
  isEmpty?: boolean
  columnsCount: number
  emptyMessage?: string
  skeletonRows?: number
}

export function CompoundTableBody({
  children,
  className,
  isLoading = false,
  isEmpty = false,
  columnsCount,
  emptyMessage = "Tidak ada data ditemukan.",
  skeletonRows = 5,
  ...props
}: CompoundTableBodyProps) {
  return (
    <TableBody className={cn("divide-y divide-border", className)} {...props}>
      {isLoading ? (
        Array.from({ length: skeletonRows }).map((_, index) => (
          <TableRow
            key={index}
            className="border-b border-border hover:bg-transparent"
          >
            {Array.from({ length: columnsCount }).map((_, cIdx) => (
              <TableCell key={cIdx} className="px-4 py-4">
                <Skeleton className="h-4 w-full animate-pulse rounded-lg bg-muted/80" />
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : isEmpty ? (
        <TableRow>
          <TableCell
            colSpan={columnsCount}
            className="py-12 text-center text-xs font-medium text-muted-foreground"
          >
            {emptyMessage}
          </TableCell>
        </TableRow>
      ) : (
        children
      )}
    </TableBody>
  )
}

// ==========================================
// 6. CUSTOM TABLE ROW WITH STATES
// ==========================================
export interface CompoundTableRowProps extends React.ComponentPropsWithoutRef<
  typeof TableRow
> {
  isExpandedRow?: boolean
}

export function CompoundTableRow({
  children,
  className,
  isExpandedRow = false,
  ...props
}: CompoundTableRowProps) {
  return (
    <TableRow
      className={cn(
        isExpandedRow
          ? "bg-muted/30 hover:bg-muted/30"
          : "group cursor-pointer border-b border-border transition-colors hover:bg-muted/40",
        className
      )}
      {...props}
    >
      {children}
    </TableRow>
  )
}

// ==========================================
// 7. CUSTOM ALIGNED & PADDED CELL
// ==========================================
export interface CompoundTableCellProps extends React.ComponentPropsWithoutRef<
  typeof TableCell
> {
  align?: "left" | "center" | "right"
  isExpandedCell?: boolean
}

export function CompoundTableCell({
  children,
  className,
  align = "left",
  isExpandedCell = false,
  ...props
}: CompoundTableCellProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <TableCell
      className={cn(
        isExpandedCell
          ? "border-b border-border p-5 whitespace-normal"
          : "px-4 py-3.5 align-middle text-xs font-medium text-foreground",
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </TableCell>
  )
}

// ==========================================
// 8. DETAIL EXPAND / COLLAPSE BUTTON
// ==========================================
export interface CompoundTableExpandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isExpanded: boolean
}

export function CompoundTableExpandButton({
  isExpanded,
  className,
  ...props
}: CompoundTableExpandButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "mx-auto flex cursor-pointer items-center justify-center border-none bg-transparent text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
      {...props}
    >
      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  )
}

// ==========================================
// 9. PAGINATION WRAPPER WITH SORT & PERPAGE
// ==========================================
export interface CompoundTablePaginationProps {
  page: number
  lastPage: number
  perPage?: number
  total: number
  entityName?: string
  onPageChange: (page: number) => void
  onPerPageChange?: (perPage: number) => void
  sortOrder?: "asc" | "desc"
  onSortOrderChange?: (order: "asc" | "desc") => void
  perPageOptions?: number[]
}

export function CompoundTablePagination({
  page,
  lastPage,
  perPage = 10,
  total,
  entityName = "data",
  onPageChange,
  onPerPageChange,
  perPageOptions = [5, 10, 20, 50, 100],
}: CompoundTablePaginationProps) {
  const showingFrom = total > 0 ? (page - 1) * perPage + 1 : 0
  const showingTo = Math.min(page * perPage, total)

  const renderPaginationItems = () => {
    const pageNumbers: (number | string)[] = []
    const maxVisiblePages = 5

    if (lastPage <= maxVisiblePages) {
      for (let i = 1; i <= lastPage; i++) {
        pageNumbers.push(i)
      }
    } else {
      const startPage = Math.max(1, page - 1)
      const endPage = Math.min(lastPage, page + 1)

      if (startPage > 1) {
        pageNumbers.push(1)
        if (startPage > 2) {
          pageNumbers.push("ellipsis-start")
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== lastPage) {
          pageNumbers.push(i)
        }
      }

      if (endPage < lastPage) {
        if (endPage < lastPage - 1) {
          pageNumbers.push("ellipsis-end")
        }
        pageNumbers.push(lastPage)
      }
    }

    return pageNumbers.map((p, idx) => {
      if (typeof p === "string") {
        return (
          <PaginationItem key={`${p}-${idx}`}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return (
        <PaginationItem key={p}>
          <PaginationLink
            isActive={p === page}
            onClick={() => onPageChange(p)}
            className="cursor-pointer"
          >
            {p}
          </PaginationLink>
        </PaginationItem>
      )
    })
  }

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-border pt-4 text-xs sm:flex-row">
      <div className="flex items-center gap-4 font-semibold text-muted-foreground">
        <span>
          Menampilkan {showingFrom} - {showingTo} dari {total} {entityName}
        </span>

        <div className="flex items-center gap-2">
          {onPerPageChange && (
            <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
              <span>Tampilkan:</span>
              <Select
                key={perPage}
                onValueChange={(value) => onPerPageChange(Number(value))}
                defaultValue={perPage.toString()}
              >
                <SelectTrigger className="h-8 w-24 rounded-xl border-border bg-background text-xs focus-visible:ring-ring">
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  {perPageOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {lastPage > 1 && (
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="cursor-pointer"
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(lastPage, page + 1))}
                disabled={page === lastPage}
                className="cursor-pointer"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
