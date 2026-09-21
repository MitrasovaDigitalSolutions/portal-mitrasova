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
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-muted-foreground" />
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
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
                className="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">
                      {log.domain || "Semua Domain"}
                    </span>
                    <Badge
                      variant={isSuccess ? "default" : "destructive"}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate">
                    <Globe size={11} /> IP: {log.ip_address}
                  </p>
                </div>

                <span className="text-[11px] text-muted-foreground shrink-0 flex items-center gap-1">
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
