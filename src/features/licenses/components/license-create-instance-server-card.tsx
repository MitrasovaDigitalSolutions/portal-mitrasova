"use client"

import { useMemo, type JSX } from "react"
import { Cpu, HardDrive, MemoryStick, Server } from "lucide-react"
import { FormInput, FormSelect, FormTextarea } from "@/components/forms"
import type { ServerPackage } from "@/features/server-packages/@types/server-package"
import { formatCurrency } from "@/utils"

interface LicenseCreateInstanceServerCardProps {
  serverPackages: ServerPackage[]
  isLoadingServers: boolean
  selectedServerPackage?: ServerPackage
}

export function LicenseCreateInstanceServerCard({
  serverPackages,
  isLoadingServers,
  selectedServerPackage,
}: LicenseCreateInstanceServerCardProps): JSX.Element {
  const serverOptions = useMemo(
    () =>
      serverPackages.map((s) => ({
        value: s.id,
        label: `${s.nama} (${s.code}) - ${s.cpu || "vCPU"} / ${s.ram || "RAM"}`,
      })),
    [serverPackages]
  )

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <Server size={15} />
        </div>
        <div>
          <h2 className="text-xs font-bold text-foreground">
            2. Konfigurasi Instance & Paket Server
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Alokasikan server hosting dan tentukan identitas domain instance aplikasi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          name="nama_instance"
          label="Nama Instance / Cabang"
          placeholder="Contoh: POS Pusat Bandung, Cabang Tebet"
          required
        />

        <FormInput
          name="domain_instance"
          label="Domain / Alamat IP Instance"
          placeholder="Contoh: pos.mitrasova.com atau 192.168.1.1"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormSelect
          name="server_package_id"
          label="Pilih Paket Server Hosting"
          placeholder="Pilih paket server hosting..."
          searchPlaceholder="Cari paket server..."
          emptyMessage="Paket server tidak ditemukan."
          options={serverOptions}
          isLoading={isLoadingServers}
        />

        <FormTextarea
          name="server_notes"
          label="Catatan Server (Opsional)"
          placeholder="Catatan IP, port, atau instruksi deployment khusus..."
          rows={1}
        />
      </div>

      {selectedServerPackage && (
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <span>{selectedServerPackage.nama}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/80 text-muted-foreground border border-border">
                {selectedServerPackage.code}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground font-mono">
              {selectedServerPackage.cpu && (
                <span className="inline-flex items-center gap-1">
                  <Cpu size={11} /> {selectedServerPackage.cpu}
                </span>
              )}
              {selectedServerPackage.ram && (
                <span className="inline-flex items-center gap-1">
                  <MemoryStick size={11} /> {selectedServerPackage.ram}
                </span>
              )}
              {selectedServerPackage.storage && (
                <span className="inline-flex items-center gap-1">
                  <HardDrive size={11} /> {selectedServerPackage.storage}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
            <span className="text-muted-foreground">
              Bln:{" "}
              <strong className="text-foreground">
                {formatCurrency(Number(selectedServerPackage.harga_bulanan) || 0)}
              </strong>
            </span>
            <span className="text-muted-foreground">
              Thn:{" "}
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
