/**
 * Reusable loading spinner — supporting "full" and "compact" variants.
 * Adapts beautifully to dark mode and neutral theme tokens.
 */
export interface PageLoaderProps {
  message?: string
  variant?: "full" | "compact"
}

export function PageLoader({
  message = "Memuat...",
  variant = "full",
}: PageLoaderProps) {
  if (variant === "compact") {
    return (
      <div className="flex w-full flex-col items-center justify-center bg-transparent py-6 text-center">
        <div className="relative mb-2 flex h-8 w-8 items-center justify-center">
          {/* Ring track */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/15" />
          {/* Spin indicator */}
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary border-r-primary/40" />
        </div>
        <p className="animate-pulse text-[11px] font-semibold tracking-wide text-muted-foreground">
          {message}
        </p>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[50vh] w-full flex-col items-center justify-center overflow-hidden bg-transparent p-6 text-center">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

      <div className="relative mb-3 flex h-12 w-12 items-center justify-center">
        {/* Ring track */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/15" />
        {/* Spin indicator */}
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-primary border-r-primary/40" />
        {/* Center Pulse */}
        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary shadow-sm" />
      </div>

      <p className="mt-1 animate-pulse text-xs font-bold tracking-wide text-foreground">
        {message}
      </p>
    </div>
  )
}
