"use client"

import { useMemo, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import {
  useClients as useClientsQuery,
  useDeleteClient,
} from "../api/client.queries"
import type { Client, ClientMetrics } from "../@types/client"

export function useClientsManagement() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const debouncedSearch = useDebounce(search, 400)

  // Query clients
  const { data, isLoading, isFetching, refetch } = useClientsQuery({
    page,
    per_page: perPage,
    search: debouncedSearch,
  })

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  // Delete mutation
  const deleteMutation = useDeleteClient()

  const clients = useMemo(() => data?.data ?? [], [data?.data])
  const meta = data?.meta

  // Compute metrics from current page or client list
  const metrics: ClientMetrics = useMemo(() => {
    const totalClients = meta?.total ?? clients.length
    let activeClients = 0
    let totalLicenses = 0
    let expiredLicenses = 0

    clients.forEach((client) => {
      const activeCount = client.active_licenses_count ?? 0
      const licCount = client.licenses_count ?? client.licenses?.length ?? 0
      totalLicenses += licCount
      if (activeCount > 0) {
        activeClients += 1
      }
      if (client.licenses) {
        client.licenses.forEach((lic) => {
          if (lic.status === "expired") {
            expiredLicenses += 1
          }
        })
      }
    })

    return {
      totalClients,
      activeClients: activeClients || totalClients,
      totalLicenses,
      expiredLicenses,
    }
  }, [clients, meta?.total])

  const handleOpenCreate = () => {
    setSelectedClient(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (client: Client) => {
    setSelectedClient(client)
    setIsFormOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) {
      return
    }
    await deleteMutation.mutateAsync(clientToDelete.id)
    setClientToDelete(null)
  }

  return {
    clients,
    meta,
    search,
    setSearch,
    page,
    setPage,
    perPage,
    setPerPage,
    isLoading,
    isFetching,
    metrics,
    isFormOpen,
    setIsFormOpen,
    selectedClient,
    clientToDelete,
    setClientToDelete,
    isDeleting: deleteMutation.isPending,
    handleOpenCreate,
    handleOpenEdit,
    handleDeleteConfirm,
    refetch,
  }
}
