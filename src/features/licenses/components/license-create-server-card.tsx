"use client"

import { useMemo, type JSX } from "react"
import { Cpu, HardDrive, MemoryStick, Server } from "lucide-react"
import { FormInput, FormSelect } from "@/components/forms"
import type { ServerPackage } from "@/features/server-packages/@types/server-package"
import { formatCurrency } from "@/utils"

interface LicenseCreateServerCardProps {
  serverPackages: ServerPackage[]
  isLoadingServers: boolean
  selectedServerPackage?: ServerPackage
}

export function LicenseCreateServerCard({
  serverPackages,
  isLoadingServers,
  selectedServerPackage,
}: LicenseCreateServerCardProps): JSX.Element {
  const serverOptions = useMemo(
    () =>
      serverPackages.map((s) => ({
        value: s.id,
        label: `${s.nama} (${s.code}) - ${s.cpu || "vCPU"} / ${s.ram || "RAM"}`,
      })),
    [serverPackages]
  )

  return (
    <div className="rounded-xl border border-border bg-card p-3.5 sm:p-4 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <Server size={15} />
        </div>
        <div>
          <h2 className="text-xs font-bold text-foreground">
            Alokasi Instance & Hosting Server
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Konfigurasi identitas instance cabang dan alokasi paket hosting server.
          </p>
        </div>
      </div>

      {/* Row 1: Instance Name & Domain */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormInput
          name="nama_instance"
          label="Nama Instance / Cabang"
          placeholder="Contoh: POS Pusat Bandung"
          required
        />

        <FormInput
          name="domain_instance"
          label="Domain / IP Instance (Opsional)"
          placeholder="Contoh: pos.mitrasova.com atau 192.168.1.1"
        />
      </div>

      {/* Row 2: Server Package & Server Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormSelect
          name="server_package_id"
          label="Paket Hosting Server *"
          placeholder="Pilih paket server hosting..."
          searchPlaceholder="Cari paket server..."
          emptyMessage="Paket server tidak ditemukan."
          options={serverOptions}
          isLoading={isLoadingServers}
        />

        <FormInput
          name="server_notes"
          label="Catatan Server (Opsional)"
          placeholder="Port khusus, IP server, atau instruksi deployment..."
        />
      </div>

      {/* Compact Server Package Specs */}
      {selectedServerPackage && (
        <div className="flex flex-wrap items-center justify-between gap-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1.5 text-[11px]">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <Server size={13} className="text-indigo-600 dark:text-indigo-400" />
              <span>{selectedServerPackage.nama}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
              {selectedServerPackage.cpu && (
                <span className="inline-flex items-center gap-0.5">
                  <Cpu size={10} /> {selectedServerPackage.cpu}
                </span>
              )}
              {selectedServerPackage.ram && (
                <span className="inline-flex items-center gap-0.5">
                  <MemoryStick size={10} /> {selectedServerPackage.ram}
                </span>
              )}
              {selectedServerPackage.storage && (
                <span className="inline-flex items-center gap-0.5">
                  <HardDrive size={10} /> {selectedServerPackage.storage}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-[10px]">
            <span className="text-muted-foreground">
              Bulanan:{" "}
              <strong className="text-foreground">
                {formatCurrency(Number(selectedServerPackage.harga_bulanan) || 0)}
              </strong>
            </span>
            <span className="text-muted-foreground">
              Tahunan:{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">
                {formatCurrency(Number(selectedServerPackage.harga_tahunan) || 0)}
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
