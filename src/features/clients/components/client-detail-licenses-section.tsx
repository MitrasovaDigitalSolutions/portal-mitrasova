"use client"

import { useEffect, useMemo, type JSX } from "react"
import { useForm, FormProvider } from "react-hook-form"
import {
  CalendarClock,
  CreditCard,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { DataTableActionButton } from "@/components/ui/data-table-actions"
import { FormSelect } from "@/components/forms"
import type { CommandOption } from "@/components/ui/command-select"
import {
  getLicenseColumns,
  type LicenseColumnActions,
  LicenseMobileCard,
  type License,
  type LicenseStatus,
  type LicenseSubscriptionType,
} from "@/features/licenses"

interface LicenseFilterFormValues {
  status: LicenseStatus | "all"
  subscription: LicenseSubscriptionType | "all"
}

interface ClientDetailLicensesSectionProps {
  licenses: License[]
  filteredLicenses: License[]
  search: string
  onSearchChange: (value: string) => void
  statusFilter: LicenseStatus | "all"
  onStatusFilterChange: (value: LicenseStatus | "all") => void
  subscriptionFilter: LicenseSubscriptionType | "all"
  onSubscriptionFilterChange: (value: LicenseSubscriptionType | "all") => void
  isLoading?: boolean
  onCreateLicense: () => void
  actions: LicenseColumnActions
}

const STATUS_FILTER_OPTIONS: CommandOption[] = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Aktif" },
  { value: "trial", label: "Uji Coba" },
  { value: "suspended", label: "Ditangguhkan" },
  { value: "expired", label: "Kedaluwarsa" },
]

const SUBSCRIPTION_FILTER_OPTIONS: CommandOption[] = [
  { value: "all", label: "Semua Paket" },
  { value: "trial", label: "Uji Coba (Trial)" },
  { value: "monthly", label: "Bulanan (Monthly)" },
  { value: "yearly", label: "Tahunan (Yearly)" },
  { value: "lifetime", label: "Seumur Hidup (Lifetime)" },
]

export function ClientDetailLicensesSection({
  licenses,
  filteredLicenses,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  subscriptionFilter,
  onSubscriptionFilterChange,
  isLoading = false,
  onCreateLicense,
  actions,
}: ClientDetailLicensesSectionProps): JSX.Element {
  const columns = useMemo(() => getLicenseColumns(), [])

  const filterMethods = useForm<LicenseFilterFormValues>({
    defaultValues: {
      status: statusFilter,
      subscription: subscriptionFilter,
    },
  })

  // Synchronize when parent filter state changes
  useEffect(() => {
    filterMethods.setValue("status", statusFilter)
  }, [statusFilter, filterMethods])

  useEffect(() => {
    filterMethods.setValue("subscription", subscriptionFilter)
  }, [subscriptionFilter, filterMethods])

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3.5">
      {/* Unified Section Header & Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left: Title & Count Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <h2 className="text-sm font-bold text-foreground">
            Lisensi Instance & Aplikasi
          </h2>
          <Badge
            variant="secondary"
            className="font-mono text-xs px-2 py-0.5 rounded-md"
          >
            {licenses.length} Terdaftar
          </Badge>
        </div>

        {/* Right: Search, Filters, and Add Button in single ergonomic flow */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative w-full sm:w-48 md:w-56">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari instance, domain, key..."
              className="pl-8 pr-7 h-8 text-xs rounded-lg bg-background"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Hapus pencarian"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* FormSelect Filters */}
          <FormProvider {...filterMethods}>
            <div className="flex items-center gap-2">
              <div className="w-32">
                <FormSelect<LicenseFilterFormValues>
                  name="status"
                  options={STATUS_FILTER_OPTIONS}
                  placeholder="Semua Status"
                  size="sm"
                  onChange={(val) =>
                    onStatusFilterChange(val as LicenseStatus | "all")
                  }
                />
              </div>

              <div className="w-36">
                <FormSelect<LicenseFilterFormValues>
                  name="subscription"
                  options={SUBSCRIPTION_FILTER_OPTIONS}
                  placeholder="Semua Paket"
                  size="sm"
                  onChange={(val) =>
                    onSubscriptionFilterChange(
                      val as LicenseSubscriptionType | "all"
                    )
                  }
                />
              </div>
            </div>
          </FormProvider>

          {/* Add License Button */}
          <Button
            type="button"
            size="sm"
            onClick={onCreateLicense}
            className="h-8 px-3 rounded-lg gap-1.5 cursor-pointer text-xs font-medium shadow-xs"
          >
            <Plus size={13} />
            <span>Tambah Lisensi</span>
          </Button>
        </div>
      </div>

      {/* Licenses DataTable using TanStack Table with max 5 action buttons */}
      <DataTable
        columns={columns}
        data={filteredLicenses}
        isLoading={isLoading}
        maxActionButtons={5}
        onView={(license) => actions.onInspectDetail(license)}
        onEdit={(license) => actions.onEdit(license)}
        onDelete={(license) => actions.onDelete(license)}
        extraActions={(license) => (
          <>
            {actions.onOrder ? (
              <DataTableActionButton
                variant="emerald"
                onClick={() => actions.onOrder?.(license)}
                tooltip="Beli Perpanjangan & Add-on"
              >
                <CreditCard size={16} />
              </DataTableActionButton>
            ) : actions.onExtend ? (
              <DataTableActionButton
                variant="emerald"
                onClick={() => actions.onExtend?.(license)}
                tooltip="Perpanjang Masa Aktif"
              >
                <CalendarClock size={16} />
              </DataTableActionButton>
            ) : null}

            <DataTableActionButton
              variant="sky"
              onClick={() => actions.onResetDomain(license)}
              tooltip="Reset Domain Binding"
            >
              <RefreshCw size={16} />
            </DataTableActionButton>

            <DataTableActionButton
              variant="amber"
              onClick={() => actions.onRegenerateSecret(license)}
              tooltip="Regenerate Secret"
            >
              <ShieldAlert size={16} />
            </DataTableActionButton>
          </>
        )}
        renderCardItem={(row) => (
          <LicenseMobileCard license={row.original} actions={actions} />
        )}
      />
    </div>
  )
}
