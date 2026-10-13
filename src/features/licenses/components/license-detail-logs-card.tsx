import type { JSX } from "react"
import { Activity, Clock, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/utils"
import type { LicenseHandshakeLog } from "../@types/license"

interface LicenseDetailLogsCardProps {
  logs?: LicenseHandshakeLog[]
}

export function LicenseDetailLogsCard({
  logs = [],
}: LicenseDetailLogsCardProps): JSX.Element {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-muted-foreground" />
          <h2 className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Log Aktivitas Handshake ({logs.length})
          </h2>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
          <p>Belum ada riwayat aktivitas verifikasi handshake.</p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {logs.slice(0, 10).map((log) => {
            const isSuccess =
              log.status.toLowerCase() === "success" ||
              log.status.toLowerCase() === "active"

            return (
              <div
                key={log.id}
                className="flex items-center justify-between gap-3 py-2.5 text-xs"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-foreground">
                      {log.domain || "Semua Domain"}
                    </span>
                    <Badge
                      variant={isSuccess ? "default" : "destructive"}
                      className="px-1.5 py-0 text-[10px]"
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <p className="flex items-center gap-1.5 truncate text-[11px] text-muted-foreground">
                    <Globe size={11} /> IP: {log.ip_address}
                  </p>
                </div>

                <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock size={11} />
                  {formatDate(log.created_at)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
