import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  className?: string
}

/**
 * Reusable empty state component for tables, lists, and cards.
 */
export function EmptyState({
  icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground",
        className
      )}
    >
      {icon && <div className="mb-3 text-muted-foreground/60">{icon}</div>}
      <h4 className="text-[13px] font-bold text-foreground">{title}</h4>
      {description && (
        <p className="mt-1 max-w-70 text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}
