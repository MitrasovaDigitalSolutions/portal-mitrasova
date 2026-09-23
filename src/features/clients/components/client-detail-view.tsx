"use client"

import type { JSX } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import {
  useClientDetailManagement,
  useLicensesList,
  useLicenseActions,
} from "../hooks"
import { ClientDetailHeader } from "./client-detail-header"
import { ClientDetailInfoCard } from "./client-detail-info-card"
import { ClientDetailLicensesSection } from "./client-detail-licenses-section"
import { ClientDetailSkeleton } from "./client-detail-skeleton"
import { ClientFormDialog } from "./client-form-dialog"
import { LicenseFormDialog } from "@/features/licenses/components/license-form-dialog"
import { LicenseOrderDialog } from "@/features/licenses/components/license-order-dialog"

export interface ClientDetailViewProps {
  clientId: string
}

export function ClientDetailView({
  clientId,
}: ClientDetailViewProps): JSX.Element {
  const router = useRouter()
  const {
    client,
    licenses,
    licenseStats,
    isLoading,
    isFetching,
    isEditClientOpen,
    setIsEditClientOpen,
    isDeleteClientOpen,
    setIsDeleteClientOpen,
    isDeletingClient,
    handleDeleteClientConfirm,
    handleRefreshAll,
  } = useClientDetailManagement(clientId)

  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    subscriptionFilter,
    setSubscriptionFilter,
    filteredLicenses,
  } = useLicensesList(licenses)

  const {
    selectedLicenseForEdit,
    setSelectedLicenseForEdit,
    selectedLicenseForOrder,
    setSelectedLicenseForOrder,
    licenseToDelete,
    setLicenseToDelete,
    licenseToResetDomain,
    setLicenseToResetDomain,
    licenseToRegenerateSecret,
    setLicenseToRegenerateSecret,
    isDeletingLicense,
    isResettingDomain,
    isRegeneratingSecret,
    handleDeleteLicenseConfirm,
    handleResetDomainConfirm,
    handleRegenerateSecretConfirm,
  } = useLicenseActions()

  if (isLoading && !client) {
    return <ClientDetailSkeleton />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3.5"
    >
      <ClientDetailHeader
        client={client}
        isFetching={isFetching}
        onRefresh={handleRefreshAll}
        onEdit={() => setIsEditClientOpen(true)}
        onDelete={() => setIsDeleteClientOpen(true)}
      />

      {client && (
        <ClientDetailInfoCard client={client} licenseStats={licenseStats} />
      )}

      <ClientDetailLicensesSection
        licenses={licenses}
        filteredLicenses={filteredLicenses}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        subscriptionFilter={subscriptionFilter}
        onSubscriptionFilterChange={setSubscriptionFilter}
        isLoading={isLoading}
        onCreateLicense={() =>
          router.push(`/licenses/create?clientId=${clientId}`)
        }
        actions={{
          onInspectDetail: (lic) =>
            router.push(`/clients/${clientId}/licenses/${lic.id}`),
          onEdit: (lic) => setSelectedLicenseForEdit(lic),
          onOrder: (lic) => setSelectedLicenseForOrder(lic),
          onExtend: (lic) => setSelectedLicenseForOrder(lic),
          onResetDomain: (lic) => setLicenseToResetDomain(lic),
          onRegenerateSecret: (lic) => setLicenseToRegenerateSecret(lic),
          onDelete: (lic) => setLicenseToDelete(lic),
        }}
      />

      <ClientFormDialog
        open={isEditClientOpen}
        onOpenChange={setIsEditClientOpen}
        client={client ?? null}
      />

      <LicenseFormDialog
        open={Boolean(selectedLicenseForEdit)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLicenseForEdit(null)
          }
        }}
        clientId={clientId}
        license={selectedLicenseForEdit}
      />

      <LicenseOrderDialog
        open={Boolean(selectedLicenseForOrder)}
        onOpenChange={(open) => !open && setSelectedLicenseForOrder(null)}
        license={selectedLicenseForOrder}
      />

      <ConfirmDialog
        open={isDeleteClientOpen}
        onOpenChange={setIsDeleteClientOpen}
        title="Hapus Data Klien"
        description={`Hapus klien ${client?.nama_pemilik}? Tindakan ini akan menghapus semua lisensinya.`}
        confirmText="Hapus Klien"
        variant="danger"
        isLoading={isDeletingClient}
        onConfirm={handleDeleteClientConfirm}
      />

      <ConfirmDialog
        open={Boolean(licenseToDelete)}
        onOpenChange={(open) => !open && setLicenseToDelete(null)}
        title="Hapus Lisensi Instance"
        description={`Hapus lisensi ${licenseToDelete?.nama_instance}? Aplikasi terkait tidak dapat aktif lagi.`}
        confirmText="Hapus Lisensi"
        variant="danger"
        isLoading={isDeletingLicense}
        onConfirm={handleDeleteLicenseConfirm}
      />

      <ConfirmDialog
        open={Boolean(licenseToResetDomain)}
        onOpenChange={(open) => !open && setLicenseToResetDomain(null)}
        title="Reset Domain Binding"
        description={`Reset binding domain untuk ${licenseToResetDomain?.nama_instance}? Domain dan IP instance akan dikosongkan.`}
        confirmText="Reset Domain"
        variant="warning"
        isLoading={isResettingDomain}
        onConfirm={handleResetDomainConfirm}
      />

      <ConfirmDialog
        open={Boolean(licenseToRegenerateSecret)}
        onOpenChange={(open) => !open && setLicenseToRegenerateSecret(null)}
        title="Regenerate License Secret"
        description={`Generate secret baru untuk ${licenseToRegenerateSecret?.nama_instance}? Secret lama akan langsung tidak berlaku.`}
        confirmText="Generate Secret Baru"
        variant="warning"
        isLoading={isRegeneratingSecret}
        onConfirm={handleRegenerateSecretConfirm}
      />
    </motion.div>
  )
}
