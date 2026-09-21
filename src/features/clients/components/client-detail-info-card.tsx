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
  Puzzle
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
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      {/* 1. Profile Contacts Strip */}
      <div className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Avatar + Name Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs border border-primary/20 shadow-2xs">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-sm truncate">
                {client.nama_pemilik}
              </span>
              {client.nama_perusahaan && (
                <span className="text-xs text-muted-foreground hidden sm:inline truncate">
                  • {client.nama_perusahaan}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
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
            className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/80 bg-muted/30 hover:bg-muted/70 text-foreground transition-colors cursor-pointer text-xs"
            title="Klik untuk menyalin email"
          >
            <Mail size={12} className="text-muted-foreground shrink-0" />
            <span className="truncate max-w-[180px]">{client.email}</span>
            {copiedField === "Email" ? (
              <Check size={11} className="text-emerald-500 shrink-0" />
            ) : (
              <Copy
                size={11}
                className="text-muted-foreground/60 group-hover:text-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            )}
          </button>

          {/* Phone */}
          {client.telepon && (
            <button
              type="button"
              onClick={() => handleCopy(client.telepon, "Nomor telepon")}
              className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/80 bg-muted/30 hover:bg-muted/70 text-foreground transition-colors cursor-pointer text-xs"
              title="Klik untuk menyalin nomor telepon"
            >
              <Phone size={12} className="text-muted-foreground shrink-0" />
              <span>{client.telepon}</span>
              {copiedField === "Nomor telepon" ? (
                <Check size={11} className="text-emerald-500 shrink-0" />
              ) : (
                <Copy
                  size={11}
                  className="text-muted-foreground/60 group-hover:text-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              )}
            </button>
          )}

          {/* Address with Tooltip */}
          {client.alamat && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/80 bg-muted/30 text-foreground text-xs max-w-[220px] cursor-default">
                    <MapPin size={12} className="text-muted-foreground shrink-0" />
                    <span className="truncate">{client.alamat}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs max-w-xs">
                  {client.alamat}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* 2. Metrics Strip (4 Compact Columns) */}
      <div className="border-t border-border/70 bg-muted/15 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
        {/* Metric 1: Total Lisensi */}
        <div className="p-3 sm:px-4 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <KeyRound size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-lg font-bold tracking-tight text-foreground leading-none">
              {licenseStats.total}
            </div>
            <div className="text-[11px] font-medium text-foreground mt-0.5">
              Total Lisensi
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              Instance terdaftar
            </p>
          </div>
        </div>

        {/* Metric 2: Lisensi Aktif */}
        <div className="p-3 sm:px-4 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-lg font-bold tracking-tight text-emerald-600 dark:text-emerald-400 leading-none">
              {licenseStats.active}
            </div>
            <div className="text-[11px] font-medium text-foreground mt-0.5">
              Lisensi Aktif
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              Siap beroperasi
            </p>
          </div>
        </div>

        {/* Metric 3: Perlu Perhatian (Trial / Expired) */}
        <div className="p-3 sm:px-4 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertCircle size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-lg font-bold tracking-tight text-amber-600 dark:text-amber-400 leading-none">
              {licenseStats.expired + licenseStats.trial}
            </div>
            <div className="text-[11px] font-medium text-foreground mt-0.5">
              Perlu Perhatian
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              {licenseStats.expired} expired, {licenseStats.trial} trial
            </p>
          </div>
        </div>

        {/* Metric 4: Modul Addon */}
        <div className="p-3 sm:px-4 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Puzzle size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-lg font-bold tracking-tight text-indigo-600 dark:text-indigo-400 leading-none">
              {licenseStats.addonsCount}
            </div>
            <div className="text-[11px] font-medium text-foreground mt-0.5">
              Modul Addon
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              Fitur tambahan terpasang
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
