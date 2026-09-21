"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Invoice } from "../@types/invoice"
import { InvoiceStatusBadge } from "./invoice-status-badge"
import { formatCurrency, formatDate } from "@/utils"
import { AlertTriangle, Building, Server } from "lucide-react"

export interface InvoiceColumnOptions {
  onViewDetail?: (invoice: Invoice) => void
}

export function getInvoiceColumns(
  options?: InvoiceColumnOptions
): ColumnDef<Invoice>[] {
  return [
    {
      accessorKey: "invoice_number",
      header: "No. Invoice",
      size: 170,
      cell: ({ row }) => {
        const inv = row.original
        return (
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => options?.onViewDetail?.(inv)}
              className="font-mono font-bold text-xs text-primary hover:underline transition-all text-left cursor-pointer"
            >
              {inv.invoice_number}
            </button>
            <div className="text-[11px] text-muted-foreground">
              {formatDate(inv.created_at)}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "client",
      header: "Pelanggan",
      size: 220,
      cell: ({ row }) => {
        const client = row.original.client
        if (!client) {
          return <span className="text-muted-foreground italic text-xs">—</span>
        }
        return (
          <div className="space-y-0.5">
            <div className="font-semibold text-xs text-foreground flex items-center gap-1.5 truncate">
              <Building className="size-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{client.nama_pemilik || client.nama_usaha || "—"}</span>
            </div>
            {(client.nama_usaha || client.email) && (
              <div className="text-[11px] text-muted-foreground pl-5 truncate max-w-[200px]">
                {client.nama_usaha || client.email}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "license",
      header: "Lisensi / Layanan",
      size: 200,
      cell: ({ row }) => {
        const license = row.original.license
        if (!license) {
          return (
            <span className="text-muted-foreground italic text-xs">
              Layanan Umum
            </span>
          )
        }
        return (
          <div className="space-y-0.5">
            <div className="font-medium text-xs text-foreground flex items-center gap-1.5 truncate">
              <Server className="size-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{license.product?.name || "Produk Mitrasova"}</span>
            </div>
            <div className="text-[11px] text-muted-foreground pl-5 font-mono truncate max-w-[180px]">
              {license.nama_instance || license.domain_instance || "—"}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "total_amount",
      header: "Total Tagihan",
      size: 160,
      cell: ({ row }) => {
        const inv = row.original
        return (
          <div className="space-y-0.5">
            <div className="font-mono font-bold text-xs text-foreground">
              {formatCurrency(inv.total_amount)}
            </div>
            {inv.payment_method && (
              <div className="text-[11px] text-muted-foreground">
                {inv.payment_method}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "due_date",
      header: "Jatuh Tempo",
      size: 150,
      cell: ({ row }) => {
        const inv = row.original
        const isUnpaid = inv.status === "unpaid"
        const isOverdue =
          isUnpaid && new Date(inv.due_date).getTime() < new Date().setHours(0, 0, 0, 0)

        return (
          <div className="space-y-0.5">
            <div className="text-xs font-medium text-foreground">
              {formatDate(inv.due_date)}
            </div>
            {isOverdue && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                <AlertTriangle className="size-3 shrink-0" />
                <span>Terlambat</span>
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 130,
      cell: ({ row }) => {
        return <InvoiceStatusBadge status={row.original.status} />
      },
    },
  ]
}
