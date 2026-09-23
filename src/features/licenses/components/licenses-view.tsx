"use client"

import { useMemo, useState, type JSX } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { KeyRound, Plus, RefreshCw, Search, ShieldAlert, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { DataTableActionButton } from "@/components/ui/data-table-actions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { getLicenseColumns } from "./license-columns"
import { LicenseMobileCard } from "./license-mobile-card"
import { LicenseFormDialog } from "./license-form-dialog"
import { LicenseOrderDialog } from "./license-order-dialog"
import {
  useDeleteLicense,
  useLicenses,
  useRegenerateLicenseSecret,
  useResetLicenseDomain,
} from "../api/license.queries"
import type { License, LicenseStatus, LicenseSubscriptionType } from "../@types/license"

export function LicensesView(): JSX.Element {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<LicenseStatus | "all">("all")
  const [subscriptionFilter, setSubscriptionFilter] = useState<LicenseSubscriptionType | "all">("all")

  const [selectedForEdit, setSelectedForEdit] = useState<License | null>(null)
  const [selectedForOrder, setSelectedForOrder] = useState<License | null>(null)
  const [selectedForDelete, setSelectedForDelete] = useState<License | null>(null)
  const [selectedForResetDomain, setSelectedForResetDomain] = useState<License | null>(null)
  const [selectedForRegenerateSecret, setSelectedForRegenerateSecret] = useState<License | null>(null)

  const { data: response, isLoading } = useLicenses({
    per_page: 50,
  })

  const deleteMutation = useDeleteLicense()
  const resetDomainMutation = useResetLicenseDomain()
  const regenerateSecretMutation = useRegenerateLicenseSecret()

  const licenses = useMemo(() => response?.data ?? [], [response?.data])

  const filteredLicenses = useMemo(() => {
    return licenses.filter((license) => {
      if (statusFilter !== "all" && license.status !== statusFilter) {return false}
      if (subscriptionFilter !== "all" && license.subscription_type !== subscriptionFilter) {return false}

      if (search.trim()) {
        const query = search.toLowerCase()
        const matchName = license.nama_instance.toLowerCase().includes(query)
        const matchKey = license.license_key.toLowerCase().includes(query)
        const matchDomain = license.domain_instance?.toLowerCase().includes(query) ?? false
        const matchClient = license.client?.nama_pemilik.toLowerCase().includes(query) ?? false
        const matchProduct = license.product?.nama.toLowerCase().includes(query) ?? false
        return matchName || matchKey || matchDomain || matchClient || matchProduct
      }
      return true
    })
  }, [licenses, statusFilter, subscriptionFilter, search])

  const stats = useMemo(() => {
    const total = licenses.length
    const active = licenses.filter((l) => l.status === "active").length
    const expired = licenses.filter((l) => l.status === "expired").length
    return { total, active, expired }
  }, [licenses])

  const columns = useMemo(() => getLicenseColumns(), [])

  const handleDeleteConfirm = async () => {
    if (!selectedForDelete) {return}
    try {
      await deleteMutation.mutateAsync(selectedForDelete.id)
      setSelectedForDelete(null)
    } catch {
      // Handled by query toast
    }
  }

  const handleResetDomainConfirm = async () => {
    if (!selectedForResetDomain) {return}
    try {
      await resetDomainMutation.mutateAsync(selectedForResetDomain.id)
      setSelectedForResetDomain(null)
    } catch {
      // Handled by query toast
    }
  }

  const handleRegenerateSecretConfirm = async () => {
    if (!selectedForRegenerateSecret) {return}
    try {
      await regenerateSecretMutation.mutateAsync(selectedForRegenerateSecret.id)
      setSelectedForRegenerateSecret(null)
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
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <KeyRound size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">
                Lisensi Instance Software
              </h1>
              <Badge variant="secondary" className="font-mono text-xs">
                {stats.total} Lisensi
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Kelola seluruh instance software klien, verifikasi aktivasi, server, dan modul addon.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => router.push("/licenses/create")}
          className="h-9 px-4 gap-1.5 text-xs font-semibold cursor-pointer rounded-xl shadow-xs shrink-0"
        >
          <Plus size={14} />
          <span>Terbitkan Lisensi Baru</span>
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
              placeholder="Cari instance, klien, key..."
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

          <div className="flex flex-wrap items-center gap-2">
            {/* Subscription Filter */}
            <select
              value={subscriptionFilter}
              onChange={(e) =>
                setSubscriptionFilter(
                  e.target.value as LicenseSubscriptionType | "all"
                )
              }
              className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground cursor-pointer"
            >
              <option value="all">Semua Paket</option>
              <option value="annual">Tahunan (Annual)</option>
              <option value="monthly">Bulanan (Monthly)</option>
              <option value="lifetime">Seumur Hidup (Lifetime)</option>
              <option value="trial">Uji Coba (Trial)</option>
            </select>

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
                onClick={() => setStatusFilter("expired")}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  statusFilter === "expired"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Kedaluwarsa ({stats.expired})
              </button>
            </div>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={filteredLicenses}
          isLoading={isLoading}
          maxActionButtons={5}
          onView={(license) => router.push(`/licenses/${license.id}`)}
          onEdit={(license) => setSelectedForEdit(license)}
          onDelete={(license) => setSelectedForDelete(license)}
          extraActions={(license) => (
            <>
              <DataTableActionButton
                variant="emerald"
                onClick={() => setSelectedForOrder(license)}
                tooltip="Perpanjangan & Beli Addon"
              >
                <Plus size={16} />
              </DataTableActionButton>
              <DataTableActionButton
                variant="sky"
                onClick={() => setSelectedForResetDomain(license)}
                tooltip="Reset Domain Binding"
              >
                <RefreshCw size={16} />
              </DataTableActionButton>
              <DataTableActionButton
                variant="amber"
                onClick={() => setSelectedForRegenerateSecret(license)}
                tooltip="Regenerate Secret Key"
              >
                <ShieldAlert size={16} />
              </DataTableActionButton>
            </>
          )}
          renderCardItem={(row) => (
            <LicenseMobileCard
              license={row.original}
              actions={{
                onInspectDetail: (lic) => router.push(`/licenses/${lic.id}`),
                onEdit: (lic) => setSelectedForEdit(lic),
                onOrder: (lic) => setSelectedForOrder(lic),
                onResetDomain: (lic) => setSelectedForResetDomain(lic),
                onRegenerateSecret: (lic) => setSelectedForRegenerateSecret(lic),
                onDelete: (lic) => setSelectedForDelete(lic),
              }}
            />
          )}
        />
      </div>

      {/* Edit Form Dialog */}
      <LicenseFormDialog
        open={Boolean(selectedForEdit)}
        onOpenChange={(open) => !open && setSelectedForEdit(null)}
        clientId={selectedForEdit?.client_id ?? ""}
        license={selectedForEdit}
      />

      {/* Order / Renew Dialog */}
      <LicenseOrderDialog
        open={Boolean(selectedForOrder)}
        onOpenChange={(open) => !open && setSelectedForOrder(null)}
        license={selectedForOrder}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={Boolean(selectedForDelete)}
        onOpenChange={(open) => !open && setSelectedForDelete(null)}
        title="Hapus Lisensi Instance"
        description={`Hapus lisensi ${selectedForDelete?.nama_instance}? Aplikasi terkait tidak dapat aktif lagi.`}
        confirmText="Hapus Lisensi"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
      />

      {/* Confirm Reset Domain Dialog */}
      <ConfirmDialog
        open={Boolean(selectedForResetDomain)}
        onOpenChange={(open) => !open && setSelectedForResetDomain(null)}
        title="Reset Domain Binding"
        description={`Reset binding domain untuk ${selectedForResetDomain?.nama_instance}? Domain dan IP instance akan dikosongkan.`}
        confirmText="Reset Domain"
        variant="warning"
        isLoading={resetDomainMutation.isPending}
        onConfirm={handleResetDomainConfirm}
      />

      {/* Confirm Regenerate Secret Dialog */}
      <ConfirmDialog
        open={Boolean(selectedForRegenerateSecret)}
        onOpenChange={(open) => !open && setSelectedForRegenerateSecret(null)}
        title="Regenerate License Secret"
        description={`Generate secret baru untuk ${selectedForRegenerateSecret?.nama_instance}? Secret lama akan langsung tidak berlaku.`}
        confirmText="Generate Secret Baru"
        variant="warning"
        isLoading={regenerateSecretMutation.isPending}
        onConfirm={handleRegenerateSecretConfirm}
      />
    </motion.div>
  )
}
