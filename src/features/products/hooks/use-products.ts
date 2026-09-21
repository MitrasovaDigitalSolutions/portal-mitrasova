"use client"

import { useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks"
import { useProducts, useDeleteProduct } from "../api/product.queries"
import type { Product } from "../@types/product"

export type ProductStatusFilter = "all" | "active" | "inactive"

export function useProductsManagement() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>("all")

  // Modal dialog states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const debouncedSearch = useDebounce(searchInput, 350)

  // Fetch paginated products
  const { data, isLoading, isFetching, refetch } = useProducts({
    page,
    per_page: perPage,
    search: debouncedSearch,
    status: statusFilter,
  })

  // Delete product mutation
  const deleteMutation = useDeleteProduct()

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value)
    setPage(1)
  }, [])

  const handleStatusChange = useCallback((newStatus: ProductStatusFilter) => {
    setStatusFilter(newStatus)
    setPage(1)
  }, [])

  const handleCreate = useCallback(() => {
    setSelectedProduct(null)
    setIsFormOpen(true)
  }, [])

  const handleEdit = useCallback((product: Product) => {
    setSelectedProduct(product)
    setIsFormOpen(true)
  }, [])

  const handleViewDetail = useCallback((product: Product) => {
    router.push(`/products/${product.id}`)
  }, [router])

  const handleDeleteClick = useCallback((product: Product) => {
    setProductToDelete(product)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!productToDelete) {
      return
    }
    await deleteMutation.mutateAsync(productToDelete.id)
    setProductToDelete(null)
  }, [deleteMutation, productToDelete])

  const productsList = useMemo(() => data?.data ?? [], [data?.data])

  // Computed metrics
  const activeCount = useMemo(
    () => productsList.filter((p) => p.is_active).length,
    [productsList]
  )

  const inactiveCount = useMemo(
    () => productsList.filter((p) => !p.is_active).length,
    [productsList]
  )

  const totalAddons = useMemo(
    () =>
      productsList.reduce(
        (acc, p) => acc + (p.addons_count ?? p.addons?.length ?? 0),
        0
      ),
    [productsList]
  )

  const totalProducts = data?.meta?.total ?? productsList.length

  return {
    // Pagination & Filter State
    page,
    setPage,
    perPage,
    setPerPage,
    searchInput,
    handleSearchChange,
    statusFilter,
    handleStatusChange,

    // Data & Query States
    data,
    productsList,
    totalProducts,
    activeCount,
    inactiveCount,
    totalAddons,
    isLoading,
    isFetching,
    refetch,

    // Dialog States & Triggers
    isFormOpen,
    setIsFormOpen,
    selectedProduct,
    productToDelete,
    setProductToDelete,
    isDeleting: deleteMutation.isPending,

    // Actions
    handleCreate,
    handleEdit,
    handleViewDetail,
    handleDeleteClick,
    handleDeleteConfirm,
  }
}
