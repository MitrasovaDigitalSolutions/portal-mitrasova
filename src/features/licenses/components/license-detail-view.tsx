"use client"

import { useState, type JSX } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  AlertCircle,
  ArrowLeft,
  Activity,
  Boxes,
  Layers,
  Receipt,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/utils"

import type { Invoice } from "@/features/invoices/@types/invoice"
import { invoiceApi } from "@/features/invoices/api/invoice.api"
import { useCancelInvoice } from "@/features/invoices/api/invoice.queries"
import { InvoiceDetailDialog } from "@/features/invoices/components/invoice-detail-dialog"
import { InvoiceMarkPaidDialog } from "@/features/invoices/components/invoice-mark-paid-dialog"

import {
  useLicense,
  useDeleteLicense,
  useRegenerateLicenseSecret,
  useResetLicenseDomain,
} from "../api/license.queries"
import { LicenseDetailHeader } from "./license-detail-header"
import { LicenseDetailOverviewCard } from "./license-detail-overview-card"
import { LicenseDetailCredentialsCard } from "./license-detail-credentials-card"
import { LicenseDetailAddonsCard } from "./license-detail-addons-card"
import { LicenseDetailInvoicesCard } from "./license-detail-invoices-card"
import { LicenseDetailLogsCard } from "./license-detail-logs-card"
import { LicenseDetailPageSkeleton } from "./license-detail-page-skeleton"
import { LicenseFormDialog } from "./license-form-dialog"
import { LicenseOrderDialog } from "./license-order-dialog"

interface LicenseDetailViewProps {
  licenseId: string
  clientId?: string
}

export function LicenseDetailView({
  licenseId,
  clientId,
}: LicenseDetailViewProps): JSX.Element {
  const router = useRouter()

  // Queries & Mutations
  const { data: license, isLoading, isFetching } = useLicense(licenseId)
  const deleteMutation = useDeleteLicense()
  const regenerateSecretMutation = useRegenerateLicenseSecret()
  const resetDomainMutation = useResetLicenseDomain()
  const cancelInvoiceMutation = useCancelInvoice()

  // License Modal States
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isOrderOpen, setIsOrderOpen] = useState(false)
  const [orderInitialAddonId, setOrderInitialAddonId] = useState<string | null>(null)
  const [isResetDomainOpen, setIsResetDomainOpen] = useState(false)
  const [isRegenerateSecretOpen, setIsRegenerateSecretOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Invoice Modal States
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] =
    useState<Invoice | null>(null)
  const [selectedInvoiceForMarkPaid, setSelectedInvoiceForMarkPaid] =
    useState<Invoice | null>(null)
  const [invoiceToCancel, setInvoiceToCancel] = useState<Invoice | null>(null)
  const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null)

  // Handlers
  const handleDownloadPdf = async (inv: Invoice) => {
    try {
      setDownloadingPdfId(inv.id)
      await invoiceApi.downloadPdf(inv.id, inv.invoice_number)
      toast.success(`PDF invoice ${inv.invoice_number} berhasil diunduh`)
    } catch {
      toast.error("Gagal mengunduh PDF invoice")
    } finally {
      setDownloadingPdfId(null)
    }
  }

  const handleCancelInvoiceConfirm = async () => {
    if (!invoiceToCancel) {
      return
    }
    try {
      await cancelInvoiceMutation.mutateAsync(invoiceToCancel.id)
      setInvoiceToCancel(null)
    } catch {
      // Handled by query mutation
    }
  }

  const handleResetDomainConfirm = async () => {
    if (!license) {
      return
    }
    try {
      await resetDomainMutation.mutateAsync(license.id)
      setIsResetDomainOpen(false)
    } catch {
      // Handled by query mutation
    }
  }

  const handleRegenerateSecretConfirm = async () => {
    if (!license) {
      return
    }
    try {
      await regenerateSecretMutation.mutateAsync(license.id)
      setIsRegenerateSecretOpen(false)
    } catch {
      // Handled by query mutation
    }
  }

  const handleDeleteLicenseConfirm = async () => {
    if (!license) {
      return
    }
    try {
      await deleteMutation.mutateAsync(license.id)
      setIsDeleteOpen(false)
      const targetClientId = clientId || license.client_id
      if (targetClientId) {
        router.push(`/clients/${targetClientId}`)
      } else {
        router.push("/clients")
      }
    } catch {
      // Handled by query mutation
    }
  }

  if (isLoading && !license) {
    return <LicenseDetailPageSkeleton />
  }

  if (!license) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center space-y-3">
        <AlertCircle size={36} className="mx-auto text-destructive" />
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">
            Lisensi Tidak Ditemukan
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Lisensi dengan ID tersebut tidak ditemukan di sistem atau mungkin telah dihapus.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="gap-2 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Kembali</span>
        </Button>
      </div>
    )
  }

  const effectiveClientId = clientId || license.client_id
  const effectiveInvoices = license.invoices ?? []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="space-y-4"
    >
      {/* 1. Header & Actions */}
      <LicenseDetailHeader
        license={license}
        clientId={effectiveClientId}
        clientName={
          license.client?.nama_perusahaan || license.client?.nama_pemilik
        }
        isFetching={isFetching}
        onEdit={() => setIsEditOpen(true)}
        onOrder={() => {
          setOrderInitialAddonId(null)
          setIsOrderOpen(true)
        }}
        onResetDomain={() => setIsResetDomainOpen(true)}
        onRegenerateSecret={() => setIsRegenerateSecretOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
      />

      {/* 2. Tabs Navigation & Content */}
      <Tabs defaultValue="overview" className="w-full space-y-3">
        <TabsList className="h-9 p-1 bg-muted/60 border border-border/80">
          <TabsTrigger value="overview" className="gap-1.5 text-xs">
            <Layers size={13} />
            <span>Informasi & Kredensial</span>
          </TabsTrigger>

          <TabsTrigger value="invoices" className="gap-1.5 text-xs">
            <Receipt size={13} />
            <span>Tagihan Invoice</span>
            {effectiveInvoices.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-background font-medium">
                {effectiveInvoices.length}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger value="addons" className="gap-1.5 text-xs">
            <Boxes size={13} />
            <span>Modul Addon</span>
            {(license.licenseAddons?.length ?? license.license_addons?.length ?? 0) > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-background font-medium">
                {license.licenseAddons?.length ?? license.license_addons?.length ?? 0}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger value="logs" className="gap-1.5 text-xs">
            <Activity size={13} />
            <span>Log Aktivitas</span>
            {(license.handshakeLogs?.length ?? 0) > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-background font-medium">
                {license.handshakeLogs?.length ?? 0}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Informasi & Kredensial */}
        <TabsContent value="overview" className="space-y-3 mt-0">
          <LicenseDetailOverviewCard license={license} />
          <LicenseDetailCredentialsCard license={license} />
        </TabsContent>

        {/* Tab 2: Tagihan Invoice */}
        <TabsContent value="invoices" className="mt-0">
          <LicenseDetailInvoicesCard
            invoices={effectiveInvoices}
            downloadingPdfId={downloadingPdfId}
            onMarkPaid={(inv) => setSelectedInvoiceForMarkPaid(inv)}
            onCancelInvoice={(inv) => setInvoiceToCancel(inv)}
            onDownloadPdf={handleDownloadPdf}
            onViewDetail={(inv) => setSelectedInvoiceForDetail(inv)}
          />
        </TabsContent>

        {/* Tab 3: Modul Addon */}
        <TabsContent value="addons" className="mt-0">
          <LicenseDetailAddonsCard
            license={license}
            onOrderAddon={(addonId) => {
              setOrderInitialAddonId(addonId || null)
              setIsOrderOpen(true)
            }}
          />
        </TabsContent>

        {/* Tab 4: Log Aktivitas */}
        <TabsContent value="logs" className="mt-0">
          <LicenseDetailLogsCard logs={license.handshakeLogs} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <LicenseFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        clientId={effectiveClientId}
        license={license}
      />

      <LicenseOrderDialog
        open={isOrderOpen}
        onOpenChange={(open) => {
          setIsOrderOpen(open)
          if (!open) {
            setOrderInitialAddonId(null)
          }
        }}
        license={license}
        initialAddonId={orderInitialAddonId}
      />

      {/* Confirm Reset Domain */}
      <ConfirmDialog
        open={isResetDomainOpen}
        onOpenChange={setIsResetDomainOpen}
        title="Reset Domain Binding"
        description={
          <span>
            Apakah Anda yakin ingin melepas ikatan domain untuk instance{" "}
            <strong className="text-foreground">{license.nama_instance}</strong>? Klien
            dapat mengikatkan lisensi ke domain atau IP baru pada handshake berikutnya.
          </span>
        }
        confirmText="Ya, Reset Domain"
        cancelText="Batal"
        variant="warning"
        isLoading={resetDomainMutation.isPending}
        onConfirm={handleResetDomainConfirm}
      />

      {/* Confirm Regenerate Secret */}
      <ConfirmDialog
        open={isRegenerateSecretOpen}
        onOpenChange={setIsRegenerateSecretOpen}
        title="Regenerate License Secret"
        description={
          <span>
            Peringatan: Membuat ulang secret akan memutus handshake instance yang sedang aktif
            hingga environment server klien diperbarui dengan secret baru. Lanjutkan?
          </span>
        }
        confirmText="Ya, Buat Secret Baru"
        cancelText="Batal"
        variant="warning"
        isLoading={regenerateSecretMutation.isPending}
        onConfirm={handleRegenerateSecretConfirm}
      />

      {/* Confirm Delete License */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Hapus Lisensi Instance"
        description={
          <span>
            Apakah Anda yakin ingin menghapus lisensi{" "}
            <strong className="text-foreground">{license.nama_instance}</strong>? Semua modul
            addon dan riwayat verifikasi terkait akan ikut terhapus. Tindakan ini tidak dapat
            dibatalkan.
          </span>
        }
        confirmText="Ya, Hapus Lisensi"
        cancelText="Batal"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteLicenseConfirm}
      />

      {/* Invoice Modals */}
      <InvoiceDetailDialog
        open={Boolean(selectedInvoiceForDetail)}
        onOpenChange={(openVal) => {
          if (!openVal) {
            setSelectedInvoiceForDetail(null)
          }
        }}
        invoice={selectedInvoiceForDetail}
        onMarkPaidClick={(inv) => setSelectedInvoiceForMarkPaid(inv)}
      />

      <InvoiceMarkPaidDialog
        open={Boolean(selectedInvoiceForMarkPaid)}
        onOpenChange={(openVal) => {
          if (!openVal) {
            setSelectedInvoiceForMarkPaid(null)
          }
        }}
        invoice={selectedInvoiceForMarkPaid}
      />

      <ConfirmDialog
        open={Boolean(invoiceToCancel)}
        onOpenChange={(openVal) => {
          if (!openVal) {
            setInvoiceToCancel(null)
          }
        }}
        title="Batalkan Invoice Tagihan"
        description={
          <span>
            Apakah Anda yakin ingin membatalkan faktur tagihan{" "}
            <strong className="text-foreground">{invoiceToCancel?.invoice_number}</strong> senilai{" "}
            <strong className="text-foreground">
              {invoiceToCancel ? formatCurrency(invoiceToCancel.total_amount) : ""}
            </strong>
            ? Tindakan ini tidak dapat diurungkan.
          </span>
        }
        confirmText="Ya, Batalkan Invoice"
        cancelText="Kembali"
        variant="danger"
        isLoading={cancelInvoiceMutation.isPending}
        onConfirm={handleCancelInvoiceConfirm}
      />
    </motion.div>
  )
}
