import type { JSX } from "react"
import { Boxes, Calendar, Puzzle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/utils"
import type { License } from "../@types/license"
import { KNOWN_PRODUCT_ADDONS, formatCodeToTitle } from "../constants"

interface LicenseDetailAddonsCardProps {
  license: License
  onManageAddons: () => void
}

export function LicenseDetailAddonsCard({
  license,
  onManageAddons,
}: LicenseDetailAddonsCardProps): JSX.Element {
  const addons = license.licenseAddons ?? license.license_addons ?? []

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <Puzzle size={15} className="text-muted-foreground" />
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Modul Addon ({addons.length})
          </h2>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onManageAddons}
          className="h-7 px-2.5 text-xs gap-1.5 cursor-pointer"
        >
          <Boxes size={13} />
          <span>Kelola Modul</span>
        </Button>
      </div>

      {addons.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
          <p>Belum ada modul addon terpasang.</p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {addons.map((addon) => {
            const info = addon.productAddon ?? addon.product_addon
            const isActive = addon.status === "active"
            const knownAddon = info?.code ? KNOWN_PRODUCT_ADDONS[info.code] : undefined
            const addonName =
              info?.nama || knownAddon?.nama || (info?.code ? formatCodeToTitle(info.code) : "Modul Addon")

            return (
              <div
                key={addon.id}
                className="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground truncate">
                      {addonName}
                    </span>
                    <Badge
                      variant={isActive ? "default" : "secondary"}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {isActive ? "Aktif" : addon.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-muted/60 px-1.5 py-0.2 rounded border border-border/40">
                      {info?.code || "-"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {addon.expires_at ? formatDate(addon.expires_at) : "Permanen"}
                    </span>
                  </p>
                </div>

                {info?.harga !== undefined && (
                  <div className="text-right shrink-0 text-xs font-semibold text-foreground">
                    {formatCurrency(info.harga)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
