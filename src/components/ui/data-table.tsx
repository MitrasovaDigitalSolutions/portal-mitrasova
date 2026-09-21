"use client"

import { DataGrid } from "@/components/ui/data-grid"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { useDeviceResponsive } from "@/hooks/use-device"
import { cn } from "@/lib/utils"
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { motion } from "framer-motion"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  InfoIcon,
  LayoutGrid,
  LayoutList,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"
import * as React from "react"
import { DataTableActionButton, type DataTableActionVariant } from "./data-table-actions"
export {
  DataTableActionButton,
  DataTableTextActionButton
} from "./data-table-actions"
export type { DataTableActionVariant } from "./data-table-actions"

export interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  isFetching?: boolean
  emptyMessage?: string
  className?: string
  tableClassName?: string

  // Responsive View Props
  defaultViewMode?: "table" | "card"
  showViewToggle?: boolean
  renderCardItem?: (row: Row<TData>) => React.ReactNode
  gridClassName?: string

  // Virtualization Props
  virtualize?: boolean
  estimateRowHeight?: number
  maxHeight?: string

  // Pagination Props
  paginationMode?: "client" | "server"
  clientPagination?: boolean
  page?: number
  perPage?: number
  onPageChange?: (page: number) => void
  onPerPageChange?: (perPage: number) => void
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  entityName?: string

  extraToolbarActions?: React.ReactNode

  // Default / Server Sorting Props
  defaultSorting?: { id: string; desc: boolean }[]
  sortBy?: string
  sortOrder?: "asc" | "desc"
  onSortChange?: (
    sortBy: string | undefined,
    sortOrder: "asc" | "desc" | undefined
  ) => void
  enableSortingRemoval?: boolean

  // Row Actions Props
  onEdit?: (row: TData) => void
  onDelete?: (row: TData) => void
  onView?: (row: TData) => void
  onCheck?: (row: TData) => void
  hideEdit?: boolean | ((row: TData) => boolean)
  disableEdit?: boolean | ((row: TData) => boolean)
  hideDelete?: boolean | ((row: TData) => boolean)
  disableDelete?: boolean | ((row: TData) => boolean)
  hideView?: boolean | ((row: TData) => boolean)
  disableView?: boolean | ((row: TData) => boolean)
  hideCheck?: boolean | ((row: TData) => boolean)
  disableCheck?: boolean | ((row: TData) => boolean)
  extraActions?: (row: TData) => React.ReactNode
  maxActionButtons?: number
  viewActionClassName?: string
  actionColumnWidth?: string
  actionColumnSize?: number
  getRowClassName?: (row: TData) => string
  getRowMotionProps?: (
    row: TData
  ) => React.ComponentProps<typeof motion.tr> | undefined
}

export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  isLoading = false,
  isFetching = false,
  emptyMessage = "Tidak ada data ditemukan.",
  className,
  tableClassName,
  defaultViewMode,
  showViewToggle = true,
  renderCardItem,
  gridClassName,
  virtualize = true,
  estimateRowHeight = 44,
  maxHeight = "450px",
  page = 1,
  perPage,
  onPageChange,
  onPerPageChange,
  meta,
  entityName = "data",
  extraToolbarActions,
  clientPagination = false,
  paginationMode,

  // Default / Server Sorting Props
  defaultSorting,
  sortBy,
  sortOrder,
  onSortChange,
  enableSortingRemoval = true,

  // Row Actions Props destructured
  onEdit,
  onDelete,
  onView,
  onCheck,
  viewActionClassName,
  hideEdit,
  disableEdit,
  hideDelete,
  disableDelete,
  hideView,
  disableView,
  hideCheck,
  disableCheck,
  extraActions,
  maxActionButtons = 5,
  actionColumnWidth,
  actionColumnSize,
  getRowClassName,
  getRowMotionProps,
}: DataTableProps<TData, TValue>) {
  const { isMobile } = useDeviceResponsive()
  const [viewMode, setViewMode] = React.useState<"table" | "card">(
    defaultViewMode ?? (isMobile ? "card" : "table")
  )

  React.useEffect(() => {
    if (!defaultViewMode) {
      setViewMode(isMobile ? "card" : "table")
    }
  }, [isMobile, defaultViewMode])

  const [localPage, setLocalPage] = React.useState(1)
  const [localPerPage, setLocalPerPage] = React.useState(perPage ?? 10)

  const isClientPagination = paginationMode === "client" || clientPagination

  React.useEffect(() => {
    if (isClientPagination) {
      setLocalPage(1)
    }
  }, [data.length, isClientPagination])

  const currentPageVal = onPageChange ? page : localPage
  const perPageVal = onPerPageChange ? (perPage ?? 10) : localPerPage

  const [localSorting, setLocalSorting] = React.useState<SortingState>(
    defaultSorting ?? []
  )

  const sorting = React.useMemo<SortingState>(() => {
    if (onSortChange) {
      if (!sortBy) {
        return []
      }
      return [{ id: sortBy, desc: sortOrder === "desc" }]
    }
    return localSorting
  }, [onSortChange, sortBy, sortOrder, localSorting])

  const handleSortingChange = (updater: React.SetStateAction<SortingState>) => {
    if (onSortChange) {
      const nextSorting =
        typeof updater === "function" ? updater(sorting) : updater
      if (nextSorting.length > 0) {
        const firstSort = nextSorting[0]
        onSortChange(firstSort.id, firstSort.desc ? "desc" : "asc")
      } else {
        onSortChange(undefined, undefined)
      }
    } else {
      setLocalSorting(updater)
    }
  }

  const sortedData = React.useMemo(() => {
    if (onSortChange || sorting.length === 0) {
      return data
    }

    const sorted = [...data]
    const sortInfo = sorting[0]
    const isDesc = sortInfo.desc

    sorted.sort((a, b) => {
      const getVal = (item: unknown, path: string): unknown => {
        return path.split(".").reduce((obj: unknown, p) => {
          if (obj && typeof obj === "object") {
            return (obj as Record<string, unknown>)[p]
          }
          return undefined
        }, item)
      }

      let aVal = getVal(a, sortInfo.id)
      let bVal = getVal(b, sortInfo.id)

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
      }
      if (typeof bVal === "string") {
        bVal = bVal.toLowerCase()
      }

      if (aVal === undefined || aVal === null) {
        return isDesc ? -1 : 1
      }
      if (bVal === undefined || bVal === null) {
        return isDesc ? 1 : -1
      }

      if (aVal < bVal) {
        return isDesc ? 1 : -1
      }
      if (aVal > bVal) {
        return isDesc ? -1 : 1
      }
      return 0
    })

    return sorted
  }, [data, sorting, onSortChange])

  const paginatedData = React.useMemo(() => {
    if (!isClientPagination) {
      return sortedData
    }
    const start = (currentPageVal - 1) * perPageVal
    return sortedData.slice(start, start + perPageVal)
  }, [sortedData, isClientPagination, currentPageVal, perPageVal])

  const computedMeta = React.useMemo(() => {
    if (meta) {
      return meta
    }
    if (isClientPagination) {
      return {
        current_page: currentPageVal,
        last_page: Math.ceil(data.length / perPageVal),
        per_page: perPageVal,
        total: data.length,
      }
    }
    return undefined
  }, [meta, isClientPagination, currentPageVal, perPageVal, data.length])

  const handlePageChange = (p: number) => {
    if (onPageChange) {
      onPageChange(p)
    } else {
      setLocalPage(p)
    }
  }

  const handlePerPageChange = (pp: number) => {
    if (onPerPageChange) {
      onPerPageChange(pp)
    } else {
      setLocalPerPage(pp)
      setLocalPage(1)
    }
  }

  // Dynamically build column list based on whether actions are provided
  const tableColumns = React.useMemo(() => {
    const startIndex = (currentPageVal - 1) * (perPageVal || 0) + 1
    const noColumn: ColumnDef<TData, unknown> = {
      id: "rowNumber",
      header: "No.",
      enableSorting: false,
      size: 48,
      meta: {
        headerClassName: "text-center w-12",
        cellClassName:
          "text-center text-muted-foreground font-medium text-xs font-mono",
      },
      cell: ({ row, table: innerTable }) => {
        const sortedIndex = innerTable
          .getRowModel()
          .rows.findIndex((r) => r.id === row.id)
        return startIndex + (sortedIndex >= 0 ? sortedIndex : 0)
      },
    }

    const baseCols: ColumnDef<TData, unknown>[] = [
      noColumn,
      ...(columns as ColumnDef<TData, unknown>[]),
    ]

    const hasActions = !!(
      onEdit ||
      onDelete ||
      onView ||
      onCheck ||
      extraActions
    )
    if (!hasActions) {
      return baseCols
    }

    let maxButtons = 0
    const itemsToInspect =
      paginatedData && paginatedData.length > 0 ? paginatedData : data || []

    if (itemsToInspect.length === 0) {
      let defaultCount = 0
      if (onView) {
        defaultCount++
      }
      if (onEdit) {
        defaultCount++
      }
      if (onCheck) {
        defaultCount++
      }
      if (onDelete) {
        defaultCount++
      }
      if (extraActions) {
        defaultCount++
      }
      maxButtons = Math.max(1, defaultCount)
    } else {
      for (const item of itemsToInspect) {
        let count = 0
        const isViewHidden =
          typeof hideView === "function" ? hideView(item) : !!hideView
        const isEditHidden =
          typeof hideEdit === "function" ? hideEdit(item) : !!hideEdit
        const isCheckHidden =
          typeof hideCheck === "function" ? hideCheck(item) : !!hideCheck
        const isDeleteHidden =
          typeof hideDelete === "function" ? hideDelete(item) : !!hideDelete

        if (onView && !isViewHidden) {
          count++
        }
        if (onEdit && !isEditHidden) {
          count++
        }
        if (onCheck && !isCheckHidden) {
          count++
        }
        if (onDelete && !isDeleteHidden) {
          count++
        }

        if (extraActions) {
          const extra = extraActions(item)
          if (extra) {
            if (React.isValidElement(extra)) {
              const extraProps = extra.props as
                { children?: React.ReactNode } | undefined
              if (extra.type === React.Fragment && extraProps?.children) {
                const childrenCount = React.Children.toArray(
                  extraProps.children
                ).filter(Boolean).length
                count += childrenCount
              } else if (extraProps?.children) {
                const childrenCount = React.Children.toArray(
                  extraProps.children
                ).filter(Boolean).length
                count += Math.max(1, childrenCount)
              } else {
                count += 1
              }
            } else {
              count += 1
            }
          }
        }

        if (count > maxButtons) {
          maxButtons = count
        }
      }
    }

    const effectiveButtons = Math.min(maxActionButtons, Math.max(1, maxButtons))
    const autoActionWidth = Math.max(72, effectiveButtons * 36 + 24)
    const dynamicActionSize =
      actionColumnSize ||
      (actionColumnWidth
        ? typeof actionColumnWidth === "number"
          ? actionColumnWidth
          : parseInt(actionColumnWidth, 10) || 120
        : autoActionWidth)
    const actionColWidthClass =
      actionColumnWidth &&
        typeof actionColumnWidth === "string" &&
        isNaN(Number(actionColumnWidth))
        ? actionColumnWidth
        : undefined

    const actionColumn: ColumnDef<TData> = {
      id: "actions",
      header: () => (
        <div className="text-center font-bold text-foreground">Aksi</div>
      ),
      size: dynamicActionSize,
      meta: {
        headerClassName: cn(
          "sticky top-0 right-0 z-30 border-l border-b border-border bg-muted dark:bg-card text-center shadow-[-1px_0_0_0_var(--border),0_1px_0_0_var(--border)]",
          actionColWidthClass
        ),
        cellClassName:
          "text-center sticky right-0 bg-background dark:bg-card group-hover:bg-muted z-10 shadow-[-1px_0_0_0_var(--border)] border-l border-border transition-colors",
      },
      cell: ({ row }) => {
        const item = row.original

        const isViewHidden =
          typeof hideView === "function" ? hideView(item) : !!hideView
        const isEditHidden =
          typeof hideEdit === "function" ? hideEdit(item) : !!hideEdit
        const isCheckHidden =
          typeof hideCheck === "function" ? hideCheck(item) : !!hideCheck
        const isDeleteHidden =
          typeof hideDelete === "function" ? hideDelete(item) : !!hideDelete

        const isEditDisabled =
          typeof disableEdit === "function" ? disableEdit(item) : !!disableEdit
        const isDeleteDisabled =
          typeof disableDelete === "function"
            ? disableDelete(item)
            : !!disableDelete
        const isViewDisabled =
          typeof disableView === "function" ? disableView(item) : !!disableView
        const isCheckDisabled =
          typeof disableCheck === "function"
            ? disableCheck(item)
            : !!disableCheck

        interface ParsedActionItem {
          key: string
          label: string
          icon?: React.ReactNode
          onClick?: () => void
          disabled?: boolean
          variant?: DataTableActionVariant
          element: React.ReactNode
          isDestructive?: boolean
        }

        const actionsList: ParsedActionItem[] = []

        if (onView && !isViewHidden) {
          actionsList.push({
            key: "view",
            label: "Lihat Detail",
            icon: <InfoIcon size={16} />,
            onClick: () => onView(item),
            disabled: isViewDisabled,
            variant: "primary",
            element: (
              <DataTableActionButton
                key="view"
                variant="primary"
                onClick={() => onView(item)}
                disabled={isViewDisabled}
                tooltip="Lihat Detail"
                data-action="view"
                className={cn("table-action-view", viewActionClassName)}
              >
                <InfoIcon size={16} />
              </DataTableActionButton>
            ),
          })
        }

        if (onEdit && !isEditHidden) {
          actionsList.push({
            key: "edit",
            label: "Ubah",
            icon: <Pencil size={16} />,
            onClick: () => onEdit(item),
            disabled: isEditDisabled,
            variant: "amber",
            element: (
              <DataTableActionButton
                key="edit"
                variant="amber"
                onClick={() => onEdit(item)}
                disabled={isEditDisabled}
                tooltip="Ubah"
                data-action="edit"
                className="table-action-edit"
              >
                <Pencil size={16} />
              </DataTableActionButton>
            ),
          })
        }

        if (onCheck && !isCheckHidden) {
          actionsList.push({
            key: "check",
            label: "Finalisasi",
            icon: <Check size={16} />,
            onClick: () => onCheck(item),
            disabled: isCheckDisabled,
            variant: "emerald",
            element: (
              <DataTableActionButton
                key="check"
                variant="emerald"
                onClick={() => onCheck(item)}
                disabled={isCheckDisabled}
                tooltip="Finalisasi"
                data-action="check"
                className="table-action-check"
              >
                <Check size={16} />
              </DataTableActionButton>
            ),
          })
        }

        if (extraActions) {
          const extra = extraActions(item)
          if (extra) {
            const flatten = (node: React.ReactNode) => {
              if (!node) { return }
              if (React.isValidElement(node) && node.type === React.Fragment) {
                const fragProps = node.props as { children?: React.ReactNode }
                React.Children.forEach(fragProps.children, flatten)
              } else if (Array.isArray(node)) {
                node.forEach(flatten)
              } else if (React.isValidElement(node)) {
                const p = node.props as {
                  tooltip?: React.ReactNode
                  title?: string
                  onClick?: () => void
                  disabled?: boolean
                  children?: React.ReactNode
                  variant?: DataTableActionVariant
                  className?: string
                }
                const label =
                  (typeof p.tooltip === "string" ? p.tooltip : "") ||
                  p.title ||
                  "Aksi Tambahan"

                actionsList.push({
                  key: node.key ? String(node.key) : `extra-${actionsList.length}`,
                  label,
                  icon: p.children,
                  onClick: p.onClick,
                  disabled: p.disabled,
                  variant: p.variant,
                  element: node,
                })
              }
            }
            flatten(extra)
          }
        }

        if (onDelete && !isDeleteHidden) {
          actionsList.push({
            key: "delete",
            label: "Hapus",
            icon: <Trash2 size={16} />,
            onClick: () => onDelete(item),
            disabled: isDeleteDisabled,
            variant: "rose",
            isDestructive: true,
            element: (
              <DataTableActionButton
                key="delete"
                variant="rose"
                onClick={() => onDelete(item)}
                disabled={isDeleteDisabled}
                tooltip="Hapus"
                data-action="delete"
                className="table-action-delete"
              >
                <Trash2 size={16} />
              </DataTableActionButton>
            ),
          })
        }

        if (actionsList.length <= maxActionButtons) {
          return (
            <div className="flex items-center justify-center gap-1.5">
              {actionsList.map((action) => (
                <React.Fragment key={action.key}>{action.element}</React.Fragment>
              ))}
            </div>
          )
        }

        const directActions = actionsList.slice(0, maxActionButtons - 1)
        const overflowActions = actionsList.slice(maxActionButtons - 1)

        return (
          <div className="flex items-center justify-center gap-1.5">
            {directActions.map((action) => (
              <React.Fragment key={action.key}>{action.element}</React.Fragment>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border bg-muted/70 text-muted-foreground transition-all hover:bg-foreground hover:text-background dark:hover:bg-foreground dark:hover:text-background"
                  title="Aksi Lanjutan"
                  data-action="more-actions"
                >
                  <MoreHorizontal size={15} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-1.5 text-xs">
                {overflowActions.map((action) => (
                  <DropdownMenuItem
                    key={action.key}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-lg text-xs transition-colors",
                      action.isDestructive
                        ? "text-destructive focus:bg-destructive/10 focus:text-destructive"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {action.icon && (
                      <span className="size-4 shrink-0 flex items-center justify-center text-muted-foreground [&>svg]:size-3.5">
                        {action.icon}
                      </span>
                    )}
                    <span className="truncate font-medium">{action.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    }

    return [...baseCols, actionColumn]
  }, [
    columns,
    currentPageVal,
    perPageVal,
    data,
    paginatedData,
    onEdit,
    onDelete,
    onView,
    onCheck,
    hideEdit,
    disableEdit,
    hideDelete,
    disableDelete,
    hideView,
    disableView,
    hideCheck,
    disableCheck,
    extraActions,
    maxActionButtons,
    viewActionClassName,
    actionColumnWidth,
    actionColumnSize,
  ])

  const table = useReactTable({
    data: paginatedData,
    columns: tableColumns,
    state: {
      sorting,
    },
    getRowId: (row: TData, index: number) => {
      if (row && typeof row === "object" && "uid" in row && row.uid) {
        return String(row.uid)
      }
      if (row && typeof row === "object" && "id" in row && row.id) {
        return String(row.id)
      }
      return String(index)
    },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: !!onSortChange,
    enableSortingRemoval,
  })

  const parentRef = React.useRef<HTMLDivElement>(null)
  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 5,
    enabled: virtualize,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  const [paddingTop, paddingBottom] =
    virtualize && virtualItems.length > 0
      ? [
        Math.max(0, virtualItems[0].start),
        Math.max(
          0,
          rowVirtualizer.getTotalSize() -
          virtualItems[virtualItems.length - 1].end
        ),
      ]
      : [0, 0]

  const renderPaginationItems = () => {
    const metaToUse = computedMeta
    if (!metaToUse) {
      return null
    }

    const pageNumbers: (number | string)[] = []
    const maxVisiblePages = 5
    const totalPages = Math.max(1, metaToUse.last_page)

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      const startPage = Math.max(1, currentPageVal - 1)
      const endPage = Math.min(totalPages, currentPageVal + 1)

      if (startPage > 1) {
        pageNumbers.push(1)
        if (startPage > 2) {
          pageNumbers.push("ellipsis-start")
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pageNumbers.push(i)
        }
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("ellipsis-end")
        }
        pageNumbers.push(totalPages)
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
            isActive={p === currentPageVal}
            onClick={() => handlePageChange(p)}
          >
            {p}
          </PaginationLink>
        </PaginationItem>
      )
    })
  }

  const hasTopBar =
    extraToolbarActions !== undefined || showViewToggle !== false

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs",
        className
      )}
    >
      {/* Background update fetching indicator */}
      {isFetching && (
        <div className="absolute top-0 right-0 left-0 z-40 h-0.5 overflow-hidden bg-primary/10">
          <div className="animate-shimmer-loading h-full w-[35%] rounded-full bg-primary" />
        </div>
      )}

      {/* Top Toolbar */}
      {hasTopBar && (
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/20 p-3.5">
          <div className="flex flex-wrap items-center gap-2">
            {extraToolbarActions}
          </div>

          {showViewToggle !== false && (
            <div className="ml-auto flex shrink-0 items-center gap-1 rounded-xl border border-border bg-muted p-1">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-lg p-1.5 text-xs font-semibold transition-all",
                  viewMode === "table"
                    ? "bg-background font-bold text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Tampilan Tabel"
              >
                <LayoutList size={15} />
                <span className="xs:inline hidden text-[11px]">Tabel</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("card")}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-lg p-1.5 text-xs font-semibold transition-all",
                  viewMode === "card"
                    ? "bg-background font-bold text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Tampilan Kartu (Grid)"
              >
                <LayoutGrid size={15} />
                <span className="xs:inline hidden text-[11px]">Kartu</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Viewport: Card Grid or Table */}
      {viewMode === "card" ? (
        <DataGrid
          table={table}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          gridClassName={gridClassName}
          renderCardItem={renderCardItem}
        />
      ) : (
        <div
          ref={parentRef}
          className="max-h-[450px] w-full scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent overflow-auto"
          style={{ maxHeight: maxHeight ?? "450px" }}
        >
          <table
            className={cn("relative w-full border-separate border-spacing-0 caption-bottom text-sm", tableClassName)}
          >
            <TableHeader className="sticky top-0 z-20">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent"
                >
                  {headerGroup.headers.map((header) => {
                    const isSortable = header.column.getCanSort()
                    const sortDirection = header.column.getIsSorted()

                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          "sticky top-0 z-20 bg-muted dark:bg-card py-3 text-[10px] font-bold tracking-wider text-muted-foreground uppercase border-b border-border shadow-[0_1px_0_0_var(--border)]",
                          header.column.columnDef.meta?.headerClassName
                        )}
                        style={{
                          width: header.column.columnDef.size,
                          minWidth: header.column.columnDef.size,
                          maxWidth: header.column.columnDef.size,
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              "flex items-center gap-1.5",
                              header.column.columnDef.meta?.headerClassName?.includes(
                                "text-center"
                              ) && "justify-center",
                              header.column.columnDef.meta?.headerClassName?.includes(
                                "text-right"
                              ) && "justify-end",
                              isSortable &&
                              "cursor-pointer transition-colors select-none hover:text-foreground"
                            )}
                            onClick={
                              isSortable
                                ? header.column.getToggleSortingHandler()
                                : undefined
                            }
                          >
                            <span>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
                            {isSortable && (
                              <span className="shrink-0 text-muted-foreground">
                                {sortDirection === "asc" ? (
                                  <ArrowUp className="h-3 w-3 font-bold text-primary" />
                                ) : sortDirection === "desc" ? (
                                  <ArrowDown className="h-3 w-3 font-bold text-primary" />
                                ) : (
                                  <ArrowUpDown className="h-3 w-3 opacity-40 hover:opacity-100" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {isLoading ? (
                Array.from({
                  length: Math.min(perPage || 10, 10),
                }).map((_, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className="group border-b border-border"
                  >
                    {tableColumns.map((col, colIndex) => {
                      const isCenter =
                        col.meta?.cellClassName?.includes("text-center")
                      const isRight =
                        col.meta?.cellClassName?.includes("text-right")
                      const isAction = col.id === "actions"
                      const isNumber = col.id === "rowNumber"

                      return (
                        <TableCell
                          key={colIndex}
                          className={cn("px-4 py-3.5", col.meta?.cellClassName)}
                          style={{
                            width: col.size,
                            minWidth: col.size,
                          }}
                        >
                          {isAction ? (
                            <div className="mx-auto h-7 w-16 animate-pulse rounded-lg bg-muted/80" />
                          ) : isNumber ? (
                            <div className="mx-auto h-4 w-6 animate-pulse rounded-md bg-muted/70" />
                          ) : isRight ? (
                            <div className="ml-auto h-4 w-20 animate-pulse rounded-md bg-muted/70" />
                          ) : isCenter ? (
                            <div className="mx-auto h-4 w-16 animate-pulse rounded-md bg-muted/70" />
                          ) : colIndex === 1 ? (
                            <div className="space-y-1.5 py-0.5">
                              <div className="h-3.5 w-4/5 animate-pulse rounded-md bg-muted/80" />
                              <div className="h-2.5 w-2/5 animate-pulse rounded-md bg-muted/60" />
                            </div>
                          ) : (
                            <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted/70" />
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className="py-12 text-center text-xs font-medium text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : virtualize ? (
                <>
                  {paddingTop > 0 && (
                    <tr style={{ height: `${paddingTop}px` }}>
                      <td
                        colSpan={tableColumns.length}
                        style={{ padding: 0 }}
                      />
                    </tr>
                  )}
                  {virtualItems.map((virtualRow) => {
                    const row = rows[virtualRow.index]
                    const motionProps = getRowMotionProps?.(row.original)
                    return (
                      <motion.tr
                        key={row.id}
                        data-index={virtualRow.index}
                        ref={rowVirtualizer.measureElement}
                        className={cn(
                          "group border-b border-border transition-colors hover:bg-muted/50",
                          isFetching && "opacity-75",
                          getRowClassName?.(row.original)
                        )}
                        {...motionProps}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              "px-4 py-3.5 text-xs font-medium text-foreground border-b border-border",
                              cell.column.columnDef.meta?.cellClassName
                            )}
                            style={{
                              width: cell.column.columnDef.size,
                              minWidth: cell.column.columnDef.size,
                              maxWidth: cell.column.columnDef.size,
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </motion.tr>
                    )
                  })}
                  {paddingBottom > 0 && (
                    <tr style={{ height: `${paddingBottom}px` }}>
                      <td
                        colSpan={tableColumns.length}
                        style={{ padding: 0 }}
                      />
                    </tr>
                  )}
                </>
              ) : (
                rows.map((row) => {
                  const motionProps = getRowMotionProps?.(row.original)
                  return (
                    <motion.tr
                      key={row.id}
                      className={cn(
                        "group border-b border-border transition-colors hover:bg-muted/50",
                        isFetching && "opacity-75",
                        getRowClassName?.(row.original)
                      )}
                      {...motionProps}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "px-4 py-3.5 text-xs font-medium text-foreground border-b border-border",
                            cell.column.columnDef.meta?.cellClassName
                          )}
                          style={{
                            width: cell.column.columnDef.size,
                            minWidth: cell.column.columnDef.size,
                            maxWidth: cell.column.columnDef.size,
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </motion.tr>
                  )
                })
              )}
            </TableBody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {computedMeta &&
        (() => {
          const startItem =
            computedMeta.total > 0
              ? (computedMeta.current_page - 1) * computedMeta.per_page + 1
              : 0
          const endItem = Math.min(
            computedMeta.current_page * computedMeta.per_page,
            computedMeta.total
          )

          const renderRangeInfo = (isMobileMode = false) => {
            if (computedMeta.total <= 0) {
              return `Tidak ada ${entityName}`
            }
            if (startItem === 1 && endItem === computedMeta.total) {
              return (
                <>
                  Total{" "}
                  <span className="font-bold text-foreground">
                    {computedMeta.total}
                  </span>{" "}
                  {entityName}
                </>
              )
            }
            if (startItem === endItem) {
              return (
                <>
                  {isMobileMode ? "Item ke-" : "Menampilkan item ke-"}
                  <strong className="font-bold text-foreground">
                    {startItem}
                  </strong>{" "}
                  dari total{" "}
                  <strong className="font-bold text-foreground">
                    {computedMeta.total}
                  </strong>{" "}
                  {entityName}
                </>
              )
            }
            return (
              <>
                {isMobileMode ? "" : "Menampilkan "}
                <strong className="font-bold text-foreground">
                  {startItem}–{endItem}
                </strong>{" "}
                dari total{" "}
                <strong className="font-bold text-foreground">
                  {computedMeta.total}
                </strong>{" "}
                {entityName}
              </>
            )
          }

          const renderMobilePaginationItems = () => {
            const totalPages = computedMeta.last_page
            const current = currentPageVal

            let start = Math.max(1, current - 1)
            let end = start + 2

            if (end > totalPages) {
              end = totalPages
              start = Math.max(1, end - 2)
            }

            const pages = []
            for (let i = start; i <= end; i++) {
              pages.push(i)
            }

            return pages.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePageChange(p)}
                className={cn(
                  "flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border text-[11px] font-bold shadow-2xs transition-all",
                  p === current
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted"
                )}
              >
                {p}
              </button>
            ))
          }

          return (
            <div className="rounded-b-2xl border-t border-border bg-muted/30 p-3 sm:p-4">
              {/* Desktop Layout */}
              <div className="hidden items-center justify-between text-xs sm:flex">
                <div className="flex items-center gap-2 font-medium text-muted-foreground">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{renderRangeInfo(false)}</span>
                </div>

                <div className="flex items-center gap-4">
                  {(onPerPageChange || isClientPagination) &&
                    perPageVal !== undefined && (
                      <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Tampilkan:
                        </span>
                        <Select
                          key={perPageVal}
                          onValueChange={(value) =>
                            handlePerPageChange(Number(value))
                          }
                          defaultValue={perPageVal.toString()}
                        >
                          <SelectTrigger className="h-8 w-24 rounded-xl border-border bg-background text-xs font-semibold text-foreground shadow-2xs focus-visible:ring-ring">
                            <SelectValue placeholder="10 / hal" />
                          </SelectTrigger>
                          <SelectContent>
                            {[5, 10, 20, 50, 100].map((option) => (
                              <SelectItem
                                key={option}
                                value={option.toString()}
                              >
                                {option} / hal
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                  <Pagination className="mx-0 w-auto">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPageVal - 1)}
                          disabled={currentPageVal <= 1}
                        />
                      </PaginationItem>
                      {renderPaginationItems()}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPageVal + 1)}
                          disabled={
                            currentPageVal >= (computedMeta?.last_page ?? 1)
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="flex flex-col gap-2 text-xs sm:hidden">
                <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-muted-foreground">
                  <div className="flex min-w-0 items-center gap-1.5 truncate">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="truncate">{renderRangeInfo(true)}</span>
                  </div>

                  {(onPerPageChange || isClientPagination) &&
                    perPageVal !== undefined && (
                      <div className="flex shrink-0 items-center gap-1">
                        <Select
                          key={perPageVal}
                          onValueChange={(value) =>
                            handlePerPageChange(Number(value))
                          }
                          defaultValue={perPageVal.toString()}
                        >
                          <SelectTrigger className="h-6.5 w-20 rounded-lg border-border bg-background px-1.5 text-[10px] font-semibold">
                            <SelectValue placeholder="10 / hal" />
                          </SelectTrigger>
                          <SelectContent>
                            {[5, 10, 20, 50, 100].map((option) => (
                              <SelectItem
                                key={option}
                                value={option.toString()}
                              >
                                {option} / hal
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                </div>

                <div className="flex items-center justify-between gap-1.5 border-t border-border pt-1.5">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPageVal - 1)}
                    disabled={currentPageVal <= 1}
                    className="flex cursor-pointer items-center gap-0.5 rounded-lg border border-border bg-background px-2 py-1 text-[10px] font-semibold text-foreground shadow-2xs transition-all hover:bg-muted active:scale-95 disabled:opacity-30 sm:text-[11px]"
                  >
                    <ChevronLeft size={12} />
                    <span>Sebelumnya</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {renderMobilePaginationItems()}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPageVal + 1)}
                    disabled={currentPageVal >= (computedMeta?.last_page ?? 1)}
                    className="flex cursor-pointer items-center gap-0.5 rounded-lg border border-border bg-background px-2 py-1 text-[10px] font-semibold text-foreground shadow-2xs transition-all hover:bg-muted active:scale-95 disabled:opacity-30 sm:text-[11px]"
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          )
        })()}
    </div>
  )
}
