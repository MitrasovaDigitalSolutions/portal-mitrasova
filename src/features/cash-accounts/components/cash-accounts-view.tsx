"use client"

import { useMemo, useState, type JSX } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeftRight,
  BookOpen,
  RotateCw,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { DataTable } from "@/components/ui/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CashTransferDialog } from "@/features/cash-transfers"
import { CashTransfersTab } from "@/features/cash-transfers/components/cash-transfers-tab"
import { CashflowView } from "@/features/cashflow/components/cashflow-view"
import { useCashLedgers } from "@/features/cash-ledgers/api/cash-ledger.queries"
import { getCashLedgerColumns } from "@/features/cash-ledgers/components/cash-ledger-columns"
import { CashLedgerDetailDialog } from "@/features/cash-ledgers/components/cash-ledger-detail-dialog"
import { CashLedgersToolbar } from "@/features/cash-ledgers/components/cash-ledgers-toolbar"
import { formatRupiah } from "@/hooks/use-format-rupiah"
import {
  useCashAccounts,
  useDeleteCashAccount,
} from "../api/cash-account.queries"
import { CashAccountAdjustmentDialog } from "./cash-account-adjustment-dialog"
import { CashAccountFormDialog } from "./cash-account-form-dialog"
import { CashAccountsBar } from "./cash-accounts-bar"
import type { CashAccount } from "../@types/cash-account"
import type {
  CashLedger,
  CashLedgerMutationType,
} from "@/features/cash-ledgers/@types/cash-ledger"

export function CashAccountsView(): JSX.Element {
  // ─── 1. Cash Accounts State ───────────────────────────────────────────────
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  )
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<CashAccount | null>(null)
  const [adjustmentTarget, setAdjustmentTarget] = useState<{
    account: CashAccount
    direction: "debit" | "credit"
  } | null>(null)
  const [accountToDelete, setAccountToDelete] = useState<CashAccount | null>(
    null
  )
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // ─── 2. Transfer & Tab State ──────────────────────────────────────────────
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<
    "ledger" | "transfers" | "cashflow"
  >("ledger")

  // ─── 3. Cash Ledgers (Transaksi Kas) State ─────────────────────────────────
  const [ledgerPage, setLedgerPage] = useState(1)
  const [ledgerPerPage, setLedgerPerPage] = useState(20)
  const [selectedLedgerType, setSelectedLedgerType] = useState("")
  const [selectedMutationType, setSelectedMutationType] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [ledgerSortBy, setLedgerSortBy] = useState<string | undefined>(
    "transaction_date"
  )
  const [ledgerSortOrder, setLedgerSortOrder] = useState<
    "asc" | "desc" | undefined
  >("desc")
  const [detailLedger, setDetailLedger] = useState<CashLedger | null>(null)

  // ─── 4. Data Queries ──────────────────────────────────────────────────────
  const {
    data: accountsData,
    isLoading: isAccountsLoading,
    isFetching: isAccountsFetching,
    refetch: refetchAccounts,
  } = useCashAccounts({})

  const accounts = useMemo(() => accountsData?.data ?? [], [accountsData?.data])

  const {
    data: ledgersData,
    isLoading: isLedgersLoading,
    isFetching: isLedgersFetching,
    refetch: refetchLedgers,
  } = useCashLedgers({
    page: ledgerPage,
    per_page: ledgerPerPage,
    cash_account_id: selectedAccountId ?? undefined,
    type: selectedLedgerType || undefined,
    mutation_type: selectedMutationType
      ? (selectedMutationType as CashLedgerMutationType)
      : undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    sort_by: ledgerSortBy,
    sort_order: ledgerSortOrder,
  })

  const ledgers = useMemo(() => ledgersData?.data ?? [], [ledgersData?.data])
  const ledgerColumns = useMemo(() => getCashLedgerColumns(), [])

  // ─── 5. Mutations ─────────────────────────────────────────────────────────
  const deleteAccountMutation = useDeleteCashAccount()

  // ─── 6. Handlers ──────────────────────────────────────────────────────────
  const handleOpenAdjustment = (
    account: CashAccount,
    direction: "debit" | "credit"
  ) => {
    setAdjustmentTarget({ account, direction })
  }

  const handleOpenEdit = (account: CashAccount) => {
    setEditingAccount(account)
    setIsCreateDialogOpen(true)
  }

  const handleOpenDelete = (account: CashAccount) => {
    setAccountToDelete(account)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!accountToDelete) {
      return
    }
    await deleteAccountMutation.mutateAsync(accountToDelete.id)
    if (selectedAccountId === accountToDelete.id) {
      setSelectedAccountId(null)
    }
    setIsDeleteDialogOpen(false)
    setAccountToDelete(null)
  }

  const handleResetLedgerFilters = () => {
    setSelectedAccountId(null)
    setSelectedLedgerType("")
    setSelectedMutationType("")
    setDateFrom("")
    setDateTo("")
    setLedgerSortBy("transaction_date")
    setLedgerSortOrder("desc")
    setLedgerPage(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* ─── Header Block ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Wallet size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground sm:text-lg">
              Kelola Kas & Rekening Bank
            </h1>
            <p className="text-xs text-muted-foreground">
              Pantau saldo multi-rekening kas, lakukan pemindahan dana antar
              kas, dan telusuri seluruh riwayat mutasi transaksi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsTransferDialogOpen(true)}
            className="h-8.5 gap-1.5 rounded-xl border-border px-3 text-xs font-semibold shadow-2xs"
          >
            <ArrowLeftRight size={13} />
            <span>Transfer Saldo</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              void refetchAccounts()
              void refetchLedgers()
            }}
            disabled={isAccountsFetching || isLedgersFetching}
            className="h-8.5 rounded-xl border-border px-2.5 text-xs shadow-2xs"
            title="Muat ulang seluruh data kas"
          >
            <RotateCw
              size={13}
              className={
                isAccountsFetching || isLedgersFetching
                  ? "animate-spin text-primary"
                  : "text-muted-foreground"
              }
            />
          </Button>
        </div>
      </div>

      {/* ─── Top Section: Horizontal Scrollable Cash Account Cards ────────── */}
      <CashAccountsBar
        accounts={accounts}
        isLoading={isAccountsLoading}
        selectedAccountId={selectedAccountId}
        onSelectAccount={(accId) => {
          setSelectedAccountId(accId)
          setLedgerPage(1)
        }}
        onOpenCreate={() => {
          setEditingAccount(null)
          setIsCreateDialogOpen(true)
        }}
        onAction={handleOpenAdjustment}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* ─── Bottom Section: Ledger, Transfers & Cashflow Tabs ─────────── */}
      <Tabs
        value={activeTab}
        onValueChange={(val) =>
          setActiveTab(val as "ledger" | "transfers" | "cashflow")
        }
        className="w-full space-y-3"
      >
        <div className="flex items-center justify-between border-b border-border pb-1.5">
          <TabsList className="h-8 bg-muted/60 p-0.5">
            <TabsTrigger value="ledger" className="gap-1.5 px-3 text-xs">
              <BookOpen size={13} />
              <span>Daftar Transaksi (Buku Kas)</span>
            </TabsTrigger>
            <TabsTrigger value="transfers" className="gap-1.5 px-3 text-xs">
              <ArrowLeftRight size={13} />
              <span>Riwayat Transfer Kas</span>
            </TabsTrigger>
            <TabsTrigger value="cashflow" className="gap-1.5 px-3 text-xs">
              <TrendingUp size={13} />
              <span>Laporan & Tren Arus Kas</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Daftar Transaksi / Mutasi Buku Kas */}
        <TabsContent value="ledger" className="mt-0">
          <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-2xs">
            <CashLedgersToolbar
              accounts={accounts}
              selectedAccountId={
                selectedAccountId ? String(selectedAccountId) : ""
              }
              onAccountIdChange={(idStr) => {
                setSelectedAccountId(idStr ? Number(idStr) : null)
                setLedgerPage(1)
              }}
              selectedType={selectedLedgerType}
              onTypeChange={(t) => {
                setSelectedLedgerType(t)
                setLedgerPage(1)
              }}
              selectedMutationType={selectedMutationType}
              onMutationTypeChange={(m) => {
                setSelectedMutationType(m)
                setLedgerPage(1)
              }}
              dateFrom={dateFrom}
              onDateFromChange={(d) => {
                setDateFrom(d)
                setLedgerPage(1)
              }}
              dateTo={dateTo}
              onDateToChange={(d) => {
                setDateTo(d)
                setLedgerPage(1)
              }}
              onResetFilters={handleResetLedgerFilters}
              isFetching={isLedgersFetching}
              onRefresh={() => void refetchLedgers()}
            />

            <DataTable
              columns={ledgerColumns}
              data={ledgers}
              isLoading={isLedgersLoading}
              isFetching={isLedgersFetching}
              paginationMode="server"
              page={ledgerPage}
              perPage={ledgerPerPage}
              onPageChange={setLedgerPage}
              onPerPageChange={(newPerPage) => {
                setLedgerPerPage(newPerPage)
                setLedgerPage(1)
              }}
              sortBy={ledgerSortBy}
              sortOrder={ledgerSortOrder}
              onSortChange={(col, order) => {
                setLedgerSortBy(col)
                setLedgerSortOrder(order)
                setLedgerPage(1)
              }}
              meta={ledgersData?.meta}
              maxActionButtons={5}
              entityName="mutasi transaksi kas"
              emptyMessage={
                selectedAccountId
                  ? "Belum ada catatan transaksi pada akun kas yang dipilih."
                  : "Belum ada catatan transaksi mutasi kas."
              }
              onView={(item) => setDetailLedger(item)}
            />
          </div>
        </TabsContent>

        {/* Tab 2: Riwayat Transfer Kas */}
        <TabsContent value="transfers" className="mt-0">
          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <CashTransfersTab
              onOpenCreateTransfer={() => setIsTransferDialogOpen(true)}
            />
          </div>
        </TabsContent>

        {/* Tab 3: Laporan & Tren Arus Kas */}
        <TabsContent value="cashflow" className="mt-0">
          <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
            <CashflowView />
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── Dialogs ──────────────────────────────────────────────────────── */}
      {/* 1. Create & Edit Account Dialog */}
      <CashAccountFormDialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open)
          if (!open) {
            setEditingAccount(null)
          }
        }}
        account={editingAccount}
      />

      {/* 2. In / Out Mutation Adjustment Dialog */}
      <CashAccountAdjustmentDialog
        open={Boolean(adjustmentTarget)}
        onOpenChange={(open) => !open && setAdjustmentTarget(null)}
        target={adjustmentTarget}
      />

      {/* 3. Transfer Balance Dialog */}
      <CashTransferDialog
        open={isTransferDialogOpen}
        onOpenChange={setIsTransferDialogOpen}
      />

      {/* 4. Ledger Detail Dialog */}
      <CashLedgerDetailDialog
        open={Boolean(detailLedger)}
        onOpenChange={(open) => !open && setDetailLedger(null)}
        ledger={detailLedger}
      />

      {/* 5. Confirm Delete Account Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Hapus Akun Kas?"
        description={
          <div className="space-y-2 text-xs">
            <p>
              Apakah Anda yakin ingin menghapus akun kas{" "}
              <strong className="font-bold text-foreground">
                {accountToDelete?.name}
              </strong>
              ?
            </p>
            {accountToDelete && accountToDelete.current_balance > 0 ? (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-2.5 leading-relaxed text-destructive">
                <strong>Perhatian:</strong> Akun ini masih memiliki saldo
                sebesar{" "}
                <strong>{formatRupiah(accountToDelete.current_balance)}</strong>
                . Sistem akan menolak penghapusan akun yang saldonya belum 0
                atau memiliki riwayat mutasi transaksi.
              </p>
            ) : (
              <p className="text-muted-foreground">
                Akun kas hanya dapat dihapus jika belum memiliki riwayat mutasi
                buku kas.
              </p>
            )}
          </div>
        }
        confirmText="Ya, Hapus Akun"
        cancelText="Batal"
        variant="danger"
        isLoading={deleteAccountMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </motion.div>
  )
}
