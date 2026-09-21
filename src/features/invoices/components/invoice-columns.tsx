"use client"

import type React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import type { Invoice } from "../@types/invoice"
import { InvoiceStatusBadge } from "./invoice-status-badge"
import { DataTableActionButton } from "@/components/ui/data-table-actions"
import { formatCurrency, formatDate } from "@/utils"
import {
  FileText,
  CheckCircle2,
  Pencil,
  Trash2,
  Building,
  Server,
  AlertTriangle,
} from "lucide-react"

interface InvoiceColumnActions {
  onViewDetail: (invoice: Invoice) => void
  onMarkPaid: (invoice: Invoice) => void
  onEdit: (invoice: Invoice) => void
  onDelete: (invoice: Invoice) => void
}

export function getInvoiceColumns({
  onViewDetail,
  onMarkPaid,
  onEdit,
  onDelete,
}: InvoiceColumnActions): ColumnDef<Invoice>[] {
  return [
    {
      accessorKey: "invoice_number",
      header: "No. Invoice",
      cell: ({ row }) => {
        const inv = row.original
        return (
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => onViewDetail(inv)}
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
      cell: ({ row }) => {
        const client = row.original.client
        if (!client) {
          return <span className="text-muted-foreground italic text-xs">—</span>
        }
        return (
          <div className="space-y-0.5">
            <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
              <Building className="size-3.5 text-muted-foreground shrink-0" />
              <span>{client.nama_pemilik || client.nama_usaha || "—"}</span>
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
            <div className="font-medium text-xs text-foreground flex items-center gap-1.5">
              <Server className="size-3.5 text-emerald-500 shrink-0" />
              <span>{license.product?.name || "Produk Mitrasova"}</span>
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
      cell: ({ row }) => {
        return <InvoiceStatusBadge status={row.original.status} />
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => {
        const inv = row.original
        const isPaid = inv.status === "paid"

        return (
          <div className="flex items-center justify-end gap-1.5">
            {/* View Detail */}
            <DataTableActionButton
              variant="sky"
              tooltip="Lihat Detail"
              onClick={() => onViewDetail(inv)}
            >
              <FileText className="size-3.5" />
            </DataTableActionButton>

            {/* Mark as Paid (if not paid) */}
            {!isPaid && (
              <DataTableActionButton
                variant="emerald"
                tooltip="Tandai Lunas"
                onClick={() => onMarkPaid(inv)}
              >
                <CheckCircle2 className="size-3.5" />
              </DataTableActionButton>
            )}

            {/* Edit */}
            <DataTableActionButton
              variant="primary"
              tooltip="Edit Invoice"
              onClick={() => onEdit(inv)}
            >
              <Pencil className="size-3.5" />
            </DataTableActionButton>

            {/* Delete */}
            <DataTableActionButton
              variant="rose"
              tooltip="Hapus Invoice"
              onClick={() => onDelete(inv)}
            >
              <Trash2 className="size-3.5" />
            </DataTableActionButton>
          </div>
        )
      },
    },
  ]
}
