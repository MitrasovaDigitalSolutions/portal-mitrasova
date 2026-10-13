"use client"

import { useMemo, useState, type JSX } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Tag, X } from "lucide-react"
import { useDebounce } from "@/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { getCouponColumns } from "./coupon-columns"
import { CouponFormDialog } from "./coupon-form-dialog"
import { useCoupons, useDeleteCoupon } from "../api/coupon.queries"
import type { Coupon } from "../@types/coupon"

export function CouponsView(): JSX.Element {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all")
  const [sortBy, setSortBy] = useState<string | undefined>("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>("desc")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedForEdit, setSelectedForEdit] = useState<Coupon | null>(null)
  const [selectedForDelete, setSelectedForDelete] = useState<Coupon | null>(
    null
  )

  const debouncedSearch = useDebounce(search, 400)

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleStatusFilterChange = (status: "all" | "active" | "inactive") => {
    setStatusFilter(status)
    setPage(1)
  }

  const {
    data: response,
    isLoading,
    isFetching,
  } = useCoupons({
    page,
    per_page: perPage,
    search: debouncedSearch.trim() || undefined,
    is_active: statusFilter === "all" ? undefined : statusFilter === "active",
    sort_by: sortBy,
    sort_order: sortOrder,
  })
  const deleteMutation = useDeleteCoupon()

  const coupons = useMemo(() => response?.data ?? [], [response?.data])

  const stats = useMemo(() => {
    const total = response?.meta?.total ?? coupons.length
    const active = coupons.filter((c) => c.is_active).length
    return { total, active }
  }, [response?.meta?.total, coupons])

  const columns = useMemo(() => getCouponColumns(), [])

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
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Tag size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">
                Kupon & Kode Promo
              </h1>
              <Badge variant="secondary" className="font-mono text-xs">
                {stats.total} Kupon
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Kelola voucher diskon, potongan biaya langganan, dan promo pesanan
              lisensi klien.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="h-9 shrink-0 cursor-pointer gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-xs"
        >
          <Plus size={14} />
          <span>Buat Kupon Baru</span>
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
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari kode promo, nama..."
              className="h-8 rounded-lg bg-background pr-7 pl-8 text-xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
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
              onClick={() => handleStatusFilterChange("all")}
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
              onClick={() => handleStatusFilterChange("active")}
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
              onClick={() => handleStatusFilterChange("inactive")}
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
          data={coupons}
          isLoading={isLoading}
          isFetching={isFetching}
          paginationMode="server"
          page={page}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={(newPerPage) => {
            setPerPage(newPerPage)
            setPage(1)
          }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(col, order) => {
            setSortBy(col)
            setSortOrder(order)
            setPage(1)
          }}
          meta={response?.meta}
          maxActionButtons={5}
          onEdit={(coupon) => setSelectedForEdit(coupon)}
          onDelete={(coupon) => setSelectedForDelete(coupon)}
        />
      </div>

      {/* Form Dialog */}
      <CouponFormDialog
        open={isCreateOpen || Boolean(selectedForEdit)}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setSelectedForEdit(null)
          }
        }}
        coupon={selectedForEdit}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={Boolean(selectedForDelete)}
        onOpenChange={(open) => !open && setSelectedForDelete(null)}
        title="Hapus Kupon Promo"
        description={`Apakah Anda yakin ingin menghapus kupon ${selectedForDelete?.name} (${selectedForDelete?.code})? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Kupon"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </motion.div>
  )
}
