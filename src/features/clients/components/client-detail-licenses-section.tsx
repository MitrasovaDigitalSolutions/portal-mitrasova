"use client"

import { useEffect, useMemo, type JSX } from "react"
import { useForm, FormProvider } from "react-hook-form"
import {
  Boxes,
  CalendarClock,
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
  { value: "monthly", label: "Bulanan" },
  { value: "yearly", label: "Tahunan" },
  { value: "lifetime", label: "Lifetime" },
  { value: "trial", label: "Trial" },
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
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">
              Lisensi Instance & Aplikasi
            </h2>
            <Badge variant="secondary" className="font-mono text-xs">
              {licenses.length} Terdaftar
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Daftar lisensi software, kredensial key, binding domain, dan addons klien ini.
          </p>
        </div>

        <Button
          type="button"
          onClick={onCreateLicense}
          className="h-9 px-3.5 rounded-xl gap-1.5 cursor-pointer text-xs font-medium self-start sm:self-auto shadow-xs"
        >
          <Plus size={14} />
          <span>Tambah Lisensi Baru</span>
        </Button>
      </div>

      {/* Toolbar Filters using reusable FormSelect */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari instance, domain, key..."
            className="pl-8 pr-8 h-9 text-xs rounded-xl"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <FormProvider {...filterMethods}>
          <div className="flex items-center gap-2">
            {/* Reusable Status Filter using FormSelect */}
            <div className="w-[145px]">
              <FormSelect<LicenseFilterFormValues>
                name="status"
                options={STATUS_FILTER_OPTIONS}
                placeholder="Pilih Status"
                size="sm"
                onChange={(val) =>
                  onStatusFilterChange(val as LicenseStatus | "all")
                }
              />
            </div>

            {/* Reusable Subscription Filter using FormSelect */}
            <div className="w-[145px]">
              <FormSelect<LicenseFilterFormValues>
                name="subscription"
                options={SUBSCRIPTION_FILTER_OPTIONS}
                placeholder="Pilih Paket"
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
      </div>

      {/* Licenses DataTable using built-in action props with max 5 action buttons */}
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
            <DataTableActionButton
              variant="emerald"
              onClick={() => actions.onExtend(license)}
              tooltip="Perpanjang Masa Aktif"
            >
              <CalendarClock size={16} />
            </DataTableActionButton>

            <DataTableActionButton
              variant="indigo"
              onClick={() => actions.onSyncAddons(license)}
              tooltip="Kelola Modul Addon"
            >
              <Boxes size={16} />
            </DataTableActionButton>

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

