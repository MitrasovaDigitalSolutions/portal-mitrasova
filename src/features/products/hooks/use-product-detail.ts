"use client"

import { useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  useProduct,
  useProductAddons,
  useDeleteProduct,
  useDeleteProductAddon,
} from "../api/product.queries"
import type { ProductAddon } from "../@types/product"

export function useProductDetailManagement(productId: string) {
  const router = useRouter()
  const [addonSearch, setAddonSearch] = useState("")

  // Modal dialog states
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isAddonFormOpen, setIsAddonFormOpen] = useState(false)
  const [selectedAddon, setSelectedAddon] = useState<ProductAddon | null>(null)
  const [addonToDelete, setAddonToDelete] = useState<ProductAddon | null>(null)
  const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false)

  // Queries
  const {
    data: product,
    isLoading: isProductLoading,
    isFetching: isProductFetching,
    refetch: refetchProduct,
  } = useProduct(productId)

  const {
    data: addons = [],
    isLoading: isAddonsLoading,
    isFetching: isAddonsFetching,
    refetch: refetchAddons,
  } = useProductAddons(productId)

  // Mutations
  const deleteProductMutation = useDeleteProduct()
  const deleteAddonMutation = useDeleteProductAddon(productId)

  // Filtered addons by search
  const filteredAddons = useMemo(() => {
    if (!addonSearch.trim()) {
      return addons
    }
    const q = addonSearch.toLowerCase()
    return addons.filter(
      (a) =>
        a.nama.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q))
    )
  }, [addons, addonSearch])

  // Handlers
  const handleOpenEditProduct = useCallback(() => {
    setIsEditProductOpen(true)
  }, [])

  const handleOpenCreateAddon = useCallback(() => {
    setSelectedAddon(null)
    setIsAddonFormOpen(true)
  }, [])

  const handleOpenEditAddon = useCallback((addon: ProductAddon) => {
    setSelectedAddon(addon)
    setIsAddonFormOpen(true)
  }, [])

  const handleDeleteAddonConfirm = useCallback(async () => {
    if (!addonToDelete) {
      return
    }
    await deleteAddonMutation.mutateAsync(addonToDelete.id)
    setAddonToDelete(null)
  }, [addonToDelete, deleteAddonMutation])

  const handleDeleteProductConfirm = useCallback(async () => {
    if (!product) {
      return
    }
    await deleteProductMutation.mutateAsync(product.id)
    setIsDeleteProductOpen(false)
    router.push("/products")
  }, [deleteProductMutation, product, router])

  const handleRefreshAll = useCallback(() => {
    void refetchProduct()
    void refetchAddons()
  }, [refetchProduct, refetchAddons])

  return {
    productId,
    product,
    addons,
    filteredAddons,
    addonSearch,
    setAddonSearch,

    // Loading states
    isLoading: isProductLoading || isAddonsLoading,
    isFetching: isProductFetching || isAddonsFetching,
    isDeletingProduct: deleteProductMutation.isPending,
    isDeletingAddon: deleteAddonMutation.isPending,

    // Dialog states
    isEditProductOpen,
    setIsEditProductOpen,
    isAddonFormOpen,
    setIsAddonFormOpen,
    selectedAddon,
    addonToDelete,
    setAddonToDelete,
    isDeleteProductOpen,
    setIsDeleteProductOpen,

    // Action handlers
    handleOpenEditProduct,
    handleOpenCreateAddon,
    handleOpenEditAddon,
    handleDeleteAddonConfirm,
    handleDeleteProductConfirm,
    handleRefreshAll,
  }
}
