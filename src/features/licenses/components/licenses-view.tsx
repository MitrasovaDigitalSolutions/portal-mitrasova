"use client"

import { useEffect, useMemo, useState, type JSX } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { KeyRound, Plus, RefreshCw, Search, ShieldAlert, X } from "lucide-react"
import { useForm, FormProvider } from "react-hook-form"
import { useDebounce } from "@/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { DataTableActionButton } from "@/components/ui/data-table-actions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { FormSelect } from "@/components/forms"
import type { CommandOption } from "@/components/ui/command-select"
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
import { SUBSCRIPTION_TYPES } from "../constants"
import type {
  License,
  LicenseStatus,
  LicenseSubscriptionType,
} from "../@types/license"

interface LicenseFilterFormValues {
  subscription: LicenseSubscriptionType | "all"
}

const SUBSCRIPTION_FILTER_OPTIONS: CommandOption[] = [
  { value: "all", label: "Semua Paket" },
  { value: "annual", label: SUBSCRIPTION_TYPES.annual.label },
  { value: "monthly", label: SUBSCRIPTION_TYPES.monthly.label },
  { value: "lifetime", label: SUBSCRIPTION_TYPES.lifetime.label },
  { value: "trial", label: SUBSCRIPTION_TYPES.trial.label },
]

export function LicensesView(): JSX.Element {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<LicenseStatus | "all">("all")
  const [subscriptionFilter, setSubscriptionFilter] = useState<
    LicenseSubscriptionType | "all"
  >("all")
  const [sortBy, setSortBy] = useState<
    "created_at" | "expires_at" | "nama_instance" | "status" | undefined
  >("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>("desc")

  const debouncedSearch = useDebounce(search, 400)

  // Reset page when filters change
  const handleSearchChange = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleStatusFilterChange = (status: LicenseStatus | "all") => {
    setStatusFilter(status)
    setPage(1)
  }

  const handleSubscriptionFilterChange = (
    sub: LicenseSubscriptionType | "all"
  ) => {
    setSubscriptionFilter(sub)
    setPage(1)
  }

  const filterMethods = useForm<LicenseFilterFormValues>({
    defaultValues: {
      subscription: subscriptionFilter,
    },
  })

  // Synchronize form when state changes
  useEffect(() => {
    filterMethods.setValue("subscription", subscriptionFilter)
  }, [subscriptionFilter, filterMethods])

  const [selectedForEdit, setSelectedForEdit] = useState<License | null>(null)
  const [selectedForOrder, setSelectedForOrder] = useState<License | null>(null)
  const [selectedForDelete, setSelectedForDelete] = useState<License | null>(
    null
  )
  const [selectedForResetDomain, setSelectedForResetDomain] =
    useState<License | null>(null)
  const [selectedForRegenerateSecret, setSelectedForRegenerateSecret] =
    useState<License | null>(null)

  const {
    data: response,
    isLoading,
    isFetching,
  } = useLicenses({
    page,
    per_page: perPage,
    search: debouncedSearch.trim() || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    subscription_type:
      subscriptionFilter === "all" ? undefined : subscriptionFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
  })

  const deleteMutation = useDeleteLicense()
  const resetDomainMutation = useResetLicenseDomain()
  const regenerateSecretMutation = useRegenerateLicenseSecret()

  const licenses = useMemo(() => response?.data ?? [], [response?.data])

  const stats = useMemo(() => {
    const total = response?.meta?.total ?? licenses.length
    const active = licenses.filter((l) => l.status === "active").length
    const expired = licenses.filter((l) => l.status === "expired").length
    return { total, active, expired }
  }, [response?.meta?.total, licenses])

  const columns = useMemo(() => getLicenseColumns(), [])

  const handleDeleteConfirm = async () => {
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

  const handleResetDomainConfirm = async () => {
    if (!selectedForResetDomain) {
      return
    }
    try {
      await resetDomainMutation.mutateAsync(selectedForResetDomain.id)
      setSelectedForResetDomain(null)
    } catch {
      // Handled by query toast
    }
  }

  const handleRegenerateSecretConfirm = async () => {
    if (!selectedForRegenerateSecret) {
      return
    }
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
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
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
              Kelola seluruh instance software klien, verifikasi aktivasi,
              server, dan modul addon.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => router.push("/licenses/create")}
          className="h-9 shrink-0 cursor-pointer gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-xs"
        >
          <Plus size={14} />
          <span>Terbitkan Lisensi Baru</span>
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
              placeholder="Cari instance, klien, key..."
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

          <div className="flex flex-wrap items-center gap-2">
            {/* Subscription Filter */}
            <FormProvider {...filterMethods}>
              <div className="w-40 sm:w-44">
                <FormSelect<LicenseFilterFormValues>
                  name="subscription"
                  options={SUBSCRIPTION_FILTER_OPTIONS}
                  placeholder="Semua Paket"
                  size="sm"
                  onChange={(val) =>
                    handleSubscriptionFilterChange(
                      val as LicenseSubscriptionType | "all"
                    )
                  }
                />
              </div>
            </FormProvider>

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
                onClick={() => handleStatusFilterChange("expired")}
                className={`cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors ${
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
          data={licenses}
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
            setSortBy(
              col as
                | "created_at"
                | "expires_at"
                | "nama_instance"
                | "status"
                | undefined
            )
            setSortOrder(order)
            setPage(1)
          }}
          meta={response?.meta}
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
                onRegenerateSecret: (lic) =>
                  setSelectedForRegenerateSecret(lic),
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
