"use client"

import type React from "react"
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Puzzle,
} from "lucide-react"
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
}: ClientDetailInfoCardProps): React.JSX.Element {
  const formattedJoinDate = client.created_at
    ? new Date(client.created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—"

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
      {/* Grid 1 (Kiri): Detail Profil Klien */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm border border-primary/20">
              {client.nama_pemilik.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {client.nama_pemilik}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {client.nama_perusahaan || "Pelanggan Individual"}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/60 text-xs">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Mail size={13} className="shrink-0 text-muted-foreground" />
              <span className="text-foreground truncate">{client.email}</span>
            </div>

            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Phone size={13} className="shrink-0 text-muted-foreground" />
              <span className="text-foreground">{client.telepon || "—"}</span>
            </div>

            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Building2 size={13} className="shrink-0 text-muted-foreground" />
              <span className="text-foreground truncate">
                {client.nama_perusahaan || "—"}
              </span>
            </div>

            <div className="flex items-start gap-2.5 text-muted-foreground pt-0.5">
              <MapPin size={13} className="shrink-0 mt-0.5 text-muted-foreground" />
              <span className="text-foreground leading-relaxed line-clamp-2">
                {client.alamat || "Alamat belum diatur"}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground flex items-center gap-2">
          <Calendar size={12} className="shrink-0" />
          <span>Bergabung sejak {formattedJoinDate}</span>
        </div>
      </div>

      {/* Grid 2 (Tengah): Total Lisensi (Atas) & Expired/Perhatian (Bawah) */}
      <div className="flex flex-col gap-4 justify-between">
        {/* Card Atas: Total Lisensi */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Total Lisensi Instance
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <KeyRound size={17} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {licenseStats.total}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Instance terpasang klien ini
            </p>
          </div>
        </div>

        {/* Card Bawah: Expired / Perlu Perhatian */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Expired / Perlu Perhatian
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500">
              <AlertCircle size={17} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {licenseStats.expired + licenseStats.trial}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {licenseStats.expired} kedaluwarsa, {licenseStats.trial} masa trial
            </p>
          </div>
        </div>
      </div>

      {/* Grid 3 (Kanan): Lisensi Aktif (Atas) & Modul Addon (Bawah) */}
      <div className="flex flex-col gap-4 justify-between">
        {/* Card Atas: Lisensi Aktif */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Lisensi Aktif Berjalan
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 size={17} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {licenseStats.active}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Instance siap beroperasi aktif
            </p>
          </div>
        </div>

        {/* Card Bawah: Modul Addon Terpasang */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Total Modul Addon
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-500">
              <Puzzle size={17} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {licenseStats.addonsCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Fitur tambahan terpasang
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
