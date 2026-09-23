"use client"

import { useMemo, useState, type JSX } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Tag, X } from "lucide-react"
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
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedForEdit, setSelectedForEdit] = useState<Coupon | null>(null)
  const [selectedForDelete, setSelectedForDelete] = useState<Coupon | null>(null)

  const { data: response, isLoading } = useCoupons({
    per_page: 50,
  })
  const deleteMutation = useDeleteCoupon()

  const coupons = useMemo(() => response?.data ?? [], [response?.data])

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      if (statusFilter === "active" && !coupon.is_active) {return false}
      if (statusFilter === "inactive" && coupon.is_active) {return false}

      if (search.trim()) {
        const query = search.toLowerCase()
        const matchCode = coupon.code.toLowerCase().includes(query)
        const matchName = coupon.name.toLowerCase().includes(query)
        const matchDesc = coupon.description?.toLowerCase().includes(query) ?? false
        return matchCode || matchName || matchDesc
      }
      return true
    })
  }, [coupons, statusFilter, search])

  const stats = useMemo(() => {
    const total = coupons.length
    const active = coupons.filter((c) => c.is_active).length
    return { total, active }
  }, [coupons])

  const columns = useMemo(() => getCouponColumns(), [])

  const handleDelete = async () => {
    if (!selectedForDelete) {return}
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
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
              Kelola voucher diskon, potongan biaya langganan, dan promo pesanan lisensi klien.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="h-9 px-4 gap-1.5 text-xs font-semibold cursor-pointer rounded-xl shadow-xs shrink-0"
        >
          <Plus size={14} />
          <span>Buat Kupon Baru</span>
        </Button>
      </div>

      {/* Table Container & Filter Toolbar */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode promo, nama..."
              className="pl-8 pr-7 h-8 text-xs rounded-lg bg-background"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Hapus pencarian"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-muted/50 p-0.5 rounded-lg border border-border text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
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
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
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
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
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
          data={filteredCoupons}
          isLoading={isLoading}
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
