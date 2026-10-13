"use client"

import { useCallback, useMemo, useState } from "react"
import { useDebounce } from "@/hooks"
import {
  useCashAccounts,
  useDeleteCashAccount,
} from "../api/cash-account.queries"
import type {
  CashAccount,
  CashAccountStatusFilter,
  CashAdjustmentDirection,
} from "../@types/cash-account"

const SEARCH_DEBOUNCE_MS = 400

const STATUS_TO_IS_ACTIVE: Record<
  CashAccountStatusFilter,
  boolean | undefined
> = {
  all: undefined,
  active: true,
  inactive: false,
}

export interface CashAdjustmentTarget {
  account: CashAccount
  direction: CashAdjustmentDirection
}

/** Orkestrasi tab Akun Kas: filter server-side, daftar, dan state dialog. */
export function useCashAccountsTab() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] =
    useState<CashAccountStatusFilter>("all")
  const [sortBy, setSortBy] = useState<string | undefined>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>("asc")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [accountToEdit, setAccountToEdit] = useState<CashAccount | null>(null)
  const [adjustmentTarget, setAdjustmentTarget] =
    useState<CashAdjustmentTarget | null>(null)
  const [accountToDelete, setAccountToDelete] = useState<CashAccount | null>(
    null
  )

  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS)

  const { data, isLoading, isFetching, refetch } = useCashAccounts({
    search: debouncedSearch.trim() || undefined,
    is_active: STATUS_TO_IS_ACTIVE[statusFilter],
    sort_by: sortBy,
    sort_order: sortOrder,
  })
  const deleteMutation = useDeleteCashAccount()

  const accounts = useMemo(() => data?.data ?? [], [data?.data])

  const closeForm = useCallback(() => {
    setIsCreateOpen(false)
    setAccountToEdit(null)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!accountToDelete) {
      return
    }
    try {
      await deleteMutation.mutateAsync(accountToDelete.id)
      setAccountToDelete(null)
    } catch {
      // Pesan error ditampilkan oleh toast pada mutation hook
    }
  }, [accountToDelete, deleteMutation])

  return {
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
    isFormOpen: isCreateOpen || Boolean(accountToEdit),
    openCreate: () => setIsCreateOpen(true),
    accountToEdit,
    openEdit: setAccountToEdit,
    closeForm,
    adjustmentTarget,
    openAdjustment: setAdjustmentTarget,
    closeAdjustment: () => setAdjustmentTarget(null),
    accountToDelete,
    openDelete: setAccountToDelete,
    closeDelete: () => setAccountToDelete(null),
    confirmDelete,
    isDeleting: deleteMutation.isPending,
  }
}
