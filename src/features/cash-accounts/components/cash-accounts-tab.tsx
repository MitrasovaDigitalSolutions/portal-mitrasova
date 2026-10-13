"use client"

import { useMemo, type JSX } from "react"
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { DataTableActionButton } from "@/components/ui/data-table-actions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { getCashAccountColumns } from "./cash-account-columns"
import { CashAccountsToolbar } from "./cash-accounts-toolbar"
import { CashAccountFormDialog } from "./cash-account-form-dialog"
import { CashAccountAdjustmentDialog } from "./cash-account-adjustment-dialog"
import { useCashAccountsTab } from "../hooks/use-cash-accounts-tab"
import type { CashAccount } from "../@types/cash-account"

export interface CashAccountsTabProps {
  onOpenTransferWithAccount: (account: CashAccount) => void
  onOpenGeneralTransfer: () => void
}

export function CashAccountsTab({
  onOpenTransferWithAccount,
  onOpenGeneralTransfer,
}: CashAccountsTabProps): JSX.Element {
  const {
    accounts,
    isLoading,
    isFetching,
    refetch,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    isFormOpen,
    openCreate,
    accountToEdit,
    openEdit,
    closeForm,
    adjustmentTarget,
    openAdjustment,
    closeAdjustment,
    accountToDelete,
    openDelete,
    closeDelete,
    confirmDelete,
    isDeleting,
  } = useCashAccountsTab()

  const columns = useMemo(() => getCashAccountColumns(), [])

  return (
    <div className="space-y-3.5">
      {/* Toolbar */}
      <CashAccountsToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        isFetching={isFetching}
        onRefresh={() => void refetch()}
        onAddAccount={openCreate}
        onTransferClick={onOpenGeneralTransfer}
      />

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={accounts}
        isLoading={isLoading}
        isFetching={isFetching}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(col, order) => {
          setSortBy(col)
          setSortOrder(order)
        }}
        maxActionButtons={5}
        entityName="akun kas"
        emptyMessage="Belum ada data akun kas yang sesuai kriteria."
        onEdit={(account) => openEdit(account)}
        onDelete={(account) => openDelete(account)}
        extraActions={(account) => (
          <>
            <DataTableActionButton
              variant="emerald"
              tooltip="Kredit (Tambah Saldo)"
              onClick={() => openAdjustment({ account, direction: "credit" })}
            >
              <ArrowDownLeft size={14} />
            </DataTableActionButton>

            <DataTableActionButton
              variant="rose"
              tooltip="Debit (Kurangi Saldo)"
              onClick={() => openAdjustment({ account, direction: "debit" })}
            >
              <ArrowUpRight size={14} />
            </DataTableActionButton>

            <DataTableActionButton
              variant="sky"
              tooltip="Transfer dari Akun Ini"
              onClick={() => onOpenTransferWithAccount(account)}
            >
              <ArrowLeftRight size={14} />
            </DataTableActionButton>
          </>
        )}
      />

      {/* Form Dialog (Create / Edit) */}
      <CashAccountFormDialog
        open={isFormOpen}
        onOpenChange={(open) => !open && closeForm()}
        account={accountToEdit}
      />

      {/* Manual Debit/Credit Adjustment Dialog */}
      <CashAccountAdjustmentDialog
        open={Boolean(adjustmentTarget)}
        onOpenChange={(open) => !open && closeAdjustment()}
        target={adjustmentTarget}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={Boolean(accountToDelete)}
        onOpenChange={(open) => !open && closeDelete()}
        title="Hapus Akun Kas"
        description={
          <span>
            Apakah Anda yakin ingin menghapus akun kas{" "}
            <strong className="text-foreground">{accountToDelete?.name}</strong>
            ? Akun yang sudah memiliki catatan mutasi kas tidak dapat dihapus.
          </span>
        }
        confirmText="Ya, Hapus Akun"
        cancelText="Batal"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
