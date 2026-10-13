"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, FolderTree, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { ExpenseCategory } from "../@types/expense-category"

export function getExpenseCategoryColumns(): ColumnDef<ExpenseCategory>[] {
  return [
    {
      accessorKey: "code",
      header: "Kode Kategori",
      size: 140,
      cell: ({ row }) => (
        <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary shadow-2xs">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Nama Kategori & Deskripsi",
      size: 360,
      cell: ({ row }) => {
        const cat = row.original
        return (
          <TooltipProvider delayDuration={200}>
            <div className="flex max-w-[350px] items-center gap-2.5">
              <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground shadow-2xs">
                <FolderTree size={14} />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="block max-w-full truncate text-xs font-semibold text-foreground">
                      {cat.name}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    <p className="font-semibold">{cat.name}</p>
                    {cat.description && (
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {cat.description}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>

                {cat.description ? (
                  <p className="truncate text-[11px] text-muted-foreground">
                    {cat.description}
                  </p>
                ) : (
                  <span className="text-[11px] text-muted-foreground/60 italic">
                    Tanpa keterangan
                  </span>
                )}
              </div>
            </div>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      size: 120,
      cell: ({ row }) =>
        row.original.is_active ? (
          <Badge
            variant="success"
            className="gap-1 text-[10px] whitespace-nowrap"
          >
            <CheckCircle2 className="size-3" />
            Aktif
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="gap-1 text-[10px] whitespace-nowrap text-muted-foreground"
          >
            <XCircle className="size-3" />
            Non-Aktif
          </Badge>
        ),
    },
  ]
}
