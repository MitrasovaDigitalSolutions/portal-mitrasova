"use client"

import { useState, useMemo, useCallback } from "react"
import { useProductAddons, useDeleteProductAddon } from "../api/product.queries"
import type { ProductAddon } from "../@types/product"

export function useProductAddonsManagement(productId: string) {
  const [search, setSearch] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedAddon, setSelectedAddon] = useState<ProductAddon | null>(null)
  const [addonToDelete, setAddonToDelete] = useState<ProductAddon | null>(null)

  const { data: addons = [], isLoading, isFetching } = useProductAddons(productId)
  const deleteMutation = useDeleteProductAddon(productId)

  // Filter addons by search term
  const filteredAddons = useMemo(() => {
    if (!search.trim()) {
      return addons
    }
    const q = search.toLowerCase()
    return addons.filter(
      (a) =>
        a.nama.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q))
    )
  }, [addons, search])

  const handleCreate = useCallback(() => {
    setSelectedAddon(null)
    setIsFormOpen(true)
  }, [])

  const handleEdit = useCallback((addon: ProductAddon) => {
    setSelectedAddon(addon)
    setIsFormOpen(true)
  }, [])

  const handleDeleteClick = useCallback((addon: ProductAddon) => {
    setAddonToDelete(addon)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!addonToDelete) {
      return
    }
    await deleteMutation.mutateAsync(addonToDelete.id)
    setAddonToDelete(null)
  }, [addonToDelete, deleteMutation])

  return {
    search,
    setSearch,
    addons,
    filteredAddons,
    isLoading,
    isFetching,
    isFormOpen,
    setIsFormOpen,
    selectedAddon,
    addonToDelete,
    setAddonToDelete,
    isDeleting: deleteMutation.isPending,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleDeleteConfirm,
  }
}
