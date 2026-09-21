"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Check,
  Clock,
  Copy,
  ExternalLink,
  Globe,
  KeyRound,
  ShieldCheck,
} from "lucide-react"
import { toast } from "sonner"

import { Card } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatDate, parseToDate } from "@/utils/date-utils"
import type { ExpiringLicenseItem } from "../@types/dashboard"
import { cn } from "@/lib/utils"

interface ExpiringLicensesTableProps {
  licenses: ExpiringLicenseItem[]
}

export function ExpiringLicensesTable({
  licenses,
}: ExpiringLicensesTableProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(key)
      toast.success("License key berhasil disalin ke clipboard")
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      toast.error("Gagal menyalin license key")
    }
  }

  // Calculate days remaining
  const getDaysRemaining = (expiresAtStr: string) => {
    const expiresDate = parseToDate(expiresAtStr)
    if (!expiresDate) {
      return null
    }
    const diffTime = expiresDate.getTime() - new Date().getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
    >
      <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 p-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Lisensi Akan Kedaluwarsa
              </h3>
              <p className="text-xs text-muted-foreground">
                Daftar instansi yang memerlukan perpanjangan dalam waktu dekat
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            {licenses.length} Perlu Perhatian
          </span>
        </div>

        {/* Content Table / Empty State */}
        {licenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={24} />
            </div>
            <h4 className="text-xs font-bold text-foreground">
              Semua Lisensi Dalam Kondisi Sehat
            </h4>
            <p className="mt-1 max-w-sm text-[11px] text-muted-foreground leading-relaxed">
              Tidak ada lisensi klien yang mendekati masa tenggang atau kedaluwarsa
              saat ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-muted/50 text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                  <th className="py-2.5 px-4">Instansi & Domain</th>
                  <th className="py-2.5 px-4">License Key</th>
                  <th className="py-2.5 px-4">Tipe Layanan</th>
                  <th className="py-2.5 px-4">Jatuh Tempo</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {licenses.map((item) => {
                  const daysRemaining = getDaysRemaining(item.expires_at)
                  const isCopied = copiedKey === item.license_key

                  return (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-muted/40"
                    >
                      {/* Instance & Domain */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.nama_instance || "Instansi Tanpa Nama"}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Globe size={11} className="shrink-0" />
                          <span className="truncate max-w-[200px]">
                            {item.domain_instance || "-"}
                          </span>
                          {item.domain_instance && (
                            <a
                              href={`https://${item.domain_instance.replace(/^https?:\/\//, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground"
                              title="Kunjungi domain"
                            >
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* License Key */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2 py-1 font-mono text-[11px] text-foreground shadow-2xs">
                          <KeyRound size={12} className="text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[140px]">
                            {item.license_key
                              ? `${item.license_key.slice(0, 8)}••••••••`
                              : "—"}
                          </span>
                          {item.license_key && (
                            <button
                              type="button"
                              onClick={() => handleCopy(item.license_key)}
                              className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors ml-1"
                              title="Salin License Key"
                            >
                              {isCopied ? (
                                <Check size={12} className="text-emerald-500" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Subscription & Server Type */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-semibold text-foreground capitalize">
                            {item.subscription_type || "Standard"}
                          </span>
                          <span className="rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary uppercase">
                            {item.server_type || "Cloud"}
                          </span>
                        </div>
                      </td>

                      {/* Expiration Date & Countdown Badge */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">
                          {formatDate(item.expires_at, "dd MMM yyyy")}
                        </div>
                        <div className="mt-0.5">
                          {daysRemaining !== null && (
                            <span
                              className={cn(
                                "inline-block rounded-md px-1.5 py-0.2 text-[10px] font-bold",
                                daysRemaining <= 0
                                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                  : daysRemaining <= 3
                                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              )}
                            >
                              {daysRemaining <= 0
                                ? "Kedaluwarsa"
                                : daysRemaining === 1
                                ? "Besok"
                                : `${daysRemaining} hari lagi`}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 text-center">
                        <StatusBadge
                          status={item.status || "active"}
                          className="mx-auto"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
