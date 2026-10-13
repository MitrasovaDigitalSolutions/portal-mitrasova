"use client"

import { useMemo, useState, type JSX } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Server, X } from "lucide-react"
import { useDebounce } from "@/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { getServerPackageColumns } from "./server-package-columns"
import { ServerPackageFormDialog } from "./server-package-form-dialog"
import {
  useDeleteServerPackage,
  useServerPackages,
} from "../api/server-package.queries"
import type { ServerPackage } from "../@types/server-package"

export function ServerPackagesView(): JSX.Element {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all")
  const [sortBy, setSortBy] = useState<
    "nama" | "code" | "harga_bulanan" | "harga_tahunan" | "created_at" | undefined
  >("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>("desc")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedForEdit, setSelectedForEdit] = useState<ServerPackage | null>(
    null
  )
  const [selectedForDelete, setSelectedForDelete] =
    useState<ServerPackage | null>(null)

  const debouncedSearch = useDebounce(search, 400)

  const {
    data: response,
    isLoading,
    isFetching,
  } = useServerPackages({
    search: debouncedSearch.trim() || undefined,
    is_active: statusFilter === "all" ? undefined : statusFilter === "active",
    sort_by: sortBy,
    sort_order: sortOrder,
  })
  const deleteMutation = useDeleteServerPackage()

  const packages = useMemo(() => response?.data ?? [], [response?.data])

  const stats = useMemo(() => {
    const total = packages.length
    const active = packages.filter((p) => p.is_active).length
    return { total, active }
  }, [packages])

  const columns = useMemo(() => getServerPackageColumns(), [])

  const handleDelete = async () => {
    if (!selectedForDelete) {
      return
    }
    try {
      await deleteMutation.mutateAsync(selectedForDelete.id)
      setSelectedForDelete(null)
    } catch {
      // Handled by query toast
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Server size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">
                Paket Server Hosting
              </h1>
              <Badge variant="secondary" className="font-mono text-xs">
                {stats.total} Paket
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Kelola spesifikasi hardware server cloud, VPS, dan biaya sewa
              hosting untuk lisensi klien.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="h-9 shrink-0 cursor-pointer gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-xs"
        >
          <Plus size={14} />
          <span>Tambah Paket Server</span>
        </Button>
      </div>

      {/* Table Container & Filter Toolbar */}
      <div className="space-y-3.5 rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search
              size={13}
              className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode, nama, deskripsi..."
              className="h-8 rounded-lg bg-background pr-7 pl-8 text-xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                title="Hapus pencarian"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors ${
                statusFilter === "active"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Aktif ({stats.active})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("inactive")}
              className={`cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors ${
                statusFilter === "inactive"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Non-Aktif ({stats.total - stats.active})
            </button>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={packages}
          isLoading={isLoading}
          isFetching={isFetching}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(col, order) => {
            setSortBy(
              col as
                | "nama"
                | "code"
                | "harga_bulanan"
                | "harga_tahunan"
                | "created_at"
                | undefined
            )
            setSortOrder(order)
          }}
          maxActionButtons={5}
          onEdit={(pkg) => setSelectedForEdit(pkg)}
          onDelete={(pkg) => setSelectedForDelete(pkg)}
        />
      </div>

      {/* Form Dialog */}
      <ServerPackageFormDialog
        open={isCreateOpen || Boolean(selectedForEdit)}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setSelectedForEdit(null)
          }
        }}
        serverPackage={selectedForEdit}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={Boolean(selectedForDelete)}
        onOpenChange={(open) => !open && setSelectedForDelete(null)}
        title="Hapus Paket Server"
        description={`Apakah Anda yakin ingin menghapus paket server ${selectedForDelete?.nama} (${selectedForDelete?.code})? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Paket Server"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </motion.div>
  )
}
