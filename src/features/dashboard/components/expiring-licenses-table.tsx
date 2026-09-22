"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
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

type UrgencyFilter = "all" | "critical" | "upcoming" | "expired"

export function ExpiringLicensesTable({
  licenses,
}: ExpiringLicensesTableProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [filter, setFilter] = useState<UrgencyFilter>("all")

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

  // Client filtered licenses
  const filteredLicenses = useMemo(() => {
    if (filter === "all") {
      return licenses
    }

    return licenses.filter((item) => {
      const days = getDaysRemaining(item.expires_at)
      if (days === null) {
        return false
      }
      if (filter === "critical") {
        return days > 0 && days <= 3
      }
      if (filter === "upcoming") {
        return days > 3 && days <= 7
      }
      if (filter === "expired") {
        return days <= 0
      }
      return true
    })
  }, [licenses, filter])

  // Counts for tabs
  const counts = useMemo(() => {
    let critical = 0
    let upcoming = 0
    let expired = 0

    for (const item of licenses) {
      const days = getDaysRemaining(item.expires_at)
      if (days !== null) {
        if (days <= 0) {
          expired++
        } else if (days <= 3) {
          critical++
        } else if (days <= 7) {
          upcoming++
        }
      }
    }

    return { all: licenses.length, critical, upcoming, expired }
  }, [licenses])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
        {/* Header with Title & Filter Tabs */}
        <div className="flex flex-col gap-3 border-b border-border/60 p-3.5 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7.5 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-400">
                <Clock size={15} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground">
                  Renewal Pipeline & Expiring Subscriptions
                </h3>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                  Antrean instansi & endpoint domain mendekati jatuh tempo atau masa tenggang
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-400">
                {licenses.length} Action Required
              </span>
              <Link
                href="/licenses"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <span>Lihat Semua</span>
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          {licenses.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-border/40">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn(
                  "cursor-pointer rounded-lg px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold transition-all select-none",
                  filter === "all"
                    ? "bg-card text-foreground shadow-2xs font-bold border border-border"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                )}
              >
                Semua ({counts.all})
              </button>

              {counts.critical > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter("critical")}
                  className={cn(
                    "cursor-pointer rounded-lg px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold transition-all select-none",
                    filter === "critical"
                      ? "bg-rose-500/15 text-rose-700 dark:text-rose-400 font-bold border border-rose-500/30"
                      : "text-rose-700/80 dark:text-rose-400/80 hover:bg-rose-500/10 border border-transparent"
                  )}
                >
                  Kritis ≤ 3 Hari ({counts.critical})
                </button>
              )}

              {counts.upcoming > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter("upcoming")}
                  className={cn(
                    "cursor-pointer rounded-lg px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold transition-all select-none",
                    filter === "upcoming"
                      ? "bg-amber-500/15 text-amber-800 dark:text-amber-400 font-bold border border-amber-500/30"
                      : "text-amber-800/80 dark:text-amber-400/80 hover:bg-amber-500/10 border border-transparent"
                  )}
                >
                  Mendekati ≤ 7 Hari ({counts.upcoming})
                </button>
              )}

              {counts.expired > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter("expired")}
                  className={cn(
                    "cursor-pointer rounded-lg px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold transition-all select-none",
                    filter === "expired"
                      ? "bg-zinc-500/15 text-zinc-800 dark:text-zinc-200 font-bold border border-zinc-500/30"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                  )}
                >
                  Grace / Expired ({counts.expired})
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content Table / Empty State */}
        {licenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center">
            <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-xs font-bold text-foreground">
              Semua Lisensi Dalam Kondisi Sehat (Optimal)
            </h4>
            <p className="mt-1 max-w-sm text-[11px] text-muted-foreground leading-relaxed">
              Tidak ada langganan mitra yang memerlukan perpanjangan mendesak atau berada dalam masa tenggang.
            </p>
          </div>
        ) : filteredLicenses.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground">
            Tidak ada lisensi yang cocok dengan filter yang dipilih.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                  <th className="py-2 px-3.5">Instance & Endpoint</th>
                  <th className="py-2 px-3.5">License Key</th>
                  <th className="py-2 px-3.5">Deployment Tier</th>
                  <th className="py-2 px-3.5">Renewal Countdown</th>
                  <th className="py-2 px-3.5 text-center">Status</th>
                  <th className="py-2 px-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {filteredLicenses.map((item) => {
                  const daysRemaining = getDaysRemaining(item.expires_at)
                  const isCopied = copiedKey === item.license_key

                  return (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-muted/40"
                    >
                      {/* Instance & Domain */}
                      <td className="py-2.5 px-3.5">
                        <Link
                          href="/licenses"
                          className="font-bold text-xs text-foreground group-hover:text-primary transition-colors block truncate max-w-[200px]"
                        >
                          {item.nama_instance || "Instance Tanpa Nama"}
                        </Link>
                        <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Globe size={10} className="shrink-0" />
                          <span className="truncate max-w-[170px] font-mono">
                            {item.domain_instance || "Belum terikat"}
                          </span>
                          {item.domain_instance && (
                            <a
                              href={`https://${item.domain_instance.replace(/^https?:\/\//, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground"
                              title="Kunjungi domain"
                            >
                              <ExternalLink size={9} />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* License Key */}
                      <td className="py-2.5 px-3.5">
                        <div className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground shadow-2xs">
                          <KeyRound size={11} className="text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[120px]">
                            {item.license_key
                              ? `${item.license_key.slice(0, 8)}••••`
                              : "—"}
                          </span>
                          {item.license_key && (
                            <button
                              type="button"
                              onClick={() => handleCopy(item.license_key)}
                              className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors ml-0.5 p-0.5"
                              title="Salin License Key"
                            >
                              {isCopied ? (
                                <Check size={11} className="text-emerald-500" />
                              ) : (
                                <Copy size={11} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Subscription & Server Type */}
                      <td className="py-2.5 px-3.5">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="rounded-md border border-border bg-muted/60 px-1.5 py-0.2 text-[9px] font-semibold text-foreground capitalize">
                            {item.subscription_type || "Standard"}
                          </span>
                          <span className="rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.2 text-[9px] font-bold text-primary uppercase">
                            {item.server_type || "Cloud"}
                          </span>
                        </div>
                      </td>

                      {/* Expiration Date & Countdown Badge */}
                      <td className="py-2.5 px-3.5">
                        <div className="font-mono text-xs font-semibold text-foreground">
                          {formatDate(item.expires_at, "dd MMM yyyy")}
                        </div>
                        <div className="mt-0.5">
                          {daysRemaining !== null && (
                            <span
                              className={cn(
                                "inline-block rounded-md px-1.5 py-0.2 text-[9px] font-bold border",
                                daysRemaining <= 0
                                  ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
                                  : daysRemaining <= 3
                                  ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
                                  : "bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/30"
                              )}
                            >
                              {daysRemaining <= 0
                                ? "Masa Tenggang"
                                : daysRemaining === 1
                                ? "Jatuh Tempo Besok"
                                : `${daysRemaining} hari lagi`}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-2.5 px-3.5 text-center">
                        <StatusBadge
                          status={item.status || "active"}
                          className="mx-auto text-[10px]"
                        />
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3.5 text-right">
                        <Link
                          href="/licenses"
                          className="inline-flex size-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-2xs transition-all hover:bg-muted hover:text-foreground hover:border-primary/40 cursor-pointer"
                          title="Buka rincian lisensi"
                        >
                          <ArrowRight size={13} />
                        </Link>
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
