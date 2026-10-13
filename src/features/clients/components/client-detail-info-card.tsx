"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Puzzle,
} from "lucide-react"
import { useState, type JSX } from "react"
import { toast } from "sonner"
import type { Client } from "../@types/client"

interface ClientDetailInfoCardProps {
  client: Client
  licenseStats: {
    total: number
    active: number
    trial: number
    expired: number
    addonsCount: number
  }
}

export function ClientDetailInfoCard({
  client,
  licenseStats,
}: ClientDetailInfoCardProps): JSX.Element {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (text: string, label: string) => {
    if (!text || text === "—") {
      return
    }
    void navigator.clipboard.writeText(text)
    setCopiedField(label)
    toast.success(`${label} disalin ke clipboard`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const initials = client.nama_pemilik
    ? client.nama_pemilik
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CL"

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      {/* 1. Profile Contacts Strip */}
      <div className="flex flex-col justify-between gap-3 p-3.5 sm:p-4 md:flex-row md:items-center">
        {/* Avatar + Name Info */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-xs font-bold text-primary shadow-2xs">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold text-foreground">
                {client.nama_pemilik}
              </span>
              {client.nama_perusahaan && (
                <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                  • {client.nama_perusahaan}
                </span>
              )}
            </div>
            <p className="truncate text-[11px] text-muted-foreground">
              {client.nama_perusahaan || "Pelanggan Terdaftar"}
            </p>
          </div>
        </div>

        {/* Contact Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Email */}
          <button
            type="button"
            onClick={() => handleCopy(client.email, "Email")}
            className="group flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted/70"
            title="Klik untuk menyalin email"
          >
            <Mail size={12} className="shrink-0 text-muted-foreground" />
            <span className="max-w-[180px] truncate">{client.email}</span>
            {copiedField === "Email" ? (
              <Check size={11} className="shrink-0 text-emerald-500" />
            ) : (
              <Copy
                size={11}
                className="shrink-0 text-muted-foreground/60 opacity-0 transition-opacity group-hover:text-foreground group-hover:opacity-100"
              />
            )}
          </button>

          {/* Phone */}
          {client.telepon && (
            <button
              type="button"
              onClick={() => handleCopy(client.telepon, "Nomor telepon")}
              className="group flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted/70"
              title="Klik untuk menyalin nomor telepon"
            >
              <Phone size={12} className="shrink-0 text-muted-foreground" />
              <span>{client.telepon}</span>
              {copiedField === "Nomor telepon" ? (
                <Check size={11} className="shrink-0 text-emerald-500" />
              ) : (
                <Copy
                  size={11}
                  className="shrink-0 text-muted-foreground/60 opacity-0 transition-opacity group-hover:text-foreground group-hover:opacity-100"
                />
              )}
            </button>
          )}

          {/* Address with Tooltip */}
          {client.alamat && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex max-w-[220px] cursor-default items-center gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-2.5 py-1 text-xs text-foreground">
                    <MapPin
                      size={12}
                      className="shrink-0 text-muted-foreground"
                    />
                    <span className="truncate">{client.alamat}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs">
                  {client.alamat}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* 2. Metrics Strip (4 Compact Columns) */}
      <div className="grid grid-cols-2 divide-y divide-border/60 border-t border-border/70 bg-muted/15 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {/* Metric 1: Total Lisensi */}
        <div className="flex items-center gap-3 p-3 sm:px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <KeyRound size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-lg leading-none font-bold tracking-tight text-foreground">
              {licenseStats.total}
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-foreground">
              Total Lisensi
            </div>
            <p className="truncate text-[10px] text-muted-foreground">
              Instance terdaftar
            </p>
          </div>
        </div>

        {/* Metric 2: Lisensi Aktif */}
        <div className="flex items-center gap-3 p-3 sm:px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-lg leading-none font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {licenseStats.active}
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-foreground">
              Lisensi Aktif
            </div>
            <p className="truncate text-[10px] text-muted-foreground">
              Siap beroperasi
            </p>
          </div>
        </div>

        {/* Metric 3: Perlu Perhatian (Trial / Expired) */}
        <div className="flex items-center gap-3 p-3 sm:px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertCircle size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-lg leading-none font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {licenseStats.expired + licenseStats.trial}
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-foreground">
              Perlu Perhatian
            </div>
            <p className="truncate text-[10px] text-muted-foreground">
              {licenseStats.expired} expired, {licenseStats.trial} trial
            </p>
          </div>
        </div>

        {/* Metric 4: Modul Addon */}
        <div className="flex items-center gap-3 p-3 sm:px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Puzzle size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-lg leading-none font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
              {licenseStats.addonsCount}
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-foreground">
              Modul Addon
            </div>
            <p className="truncate text-[10px] text-muted-foreground">
              Fitur tambahan terpasang
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
