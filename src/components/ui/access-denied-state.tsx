"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ShieldAlert,
  ArrowLeft,
  Home,
  Key,
  Copy,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/constants/routes"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface AccessDeniedStateProps {
  title?: string
  description?: string
  requiredPermission?: string
  suggestion?: string
  showHomeButton?: boolean
  showBackButton?: boolean
  showRefreshButton?: boolean
  actionButton?: React.ReactNode
  className?: string
  compact?: boolean
}

export function AccessDeniedState({
  title = "Akses Ditolak",
  description = "Anda tidak memiliki izin yang cukup untuk mengakses atau mengelola data pada halaman ini. Hubungi Administrator jika Anda memerlukan akses.",
  requiredPermission,
  suggestion,
  showHomeButton = true,
  showBackButton = true,
  showRefreshButton = false,
  actionButton,
  className,
  compact = false,
}: AccessDeniedStateProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)

  const handleCopyPermission = () => {
    if (!requiredPermission) {
      return
    }
    navigator.clipboard.writeText(requiredPermission)
    setCopied(true)
    toast.success("Kode izin berhasil disalin")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back()
    } else {
      router.push(ROUTES.HOME)
    }
  }

  const handleGoHome = () => {
    router.push(ROUTES.HOME)
  }

  if (compact) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive",
          className
        )}
      >
        <ShieldAlert className="mb-2 size-8 stroke-[2] text-destructive" />
        <h4 className="mb-1 text-sm font-bold text-foreground">{title}</h4>
        <p className="mb-3 max-w-sm text-xs text-muted-foreground">
          {description}
        </p>
        {requiredPermission && (
          <div className="mb-3 flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px] text-muted-foreground">
            <Key className="size-3" />
            <span>{requiredPermission}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="h-7 text-xs"
            >
              <ArrowLeft className="mr-1 size-3" />
              Kembali
            </Button>
          )}
          {actionButton}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex min-h-[60vh] flex-col items-center justify-center p-4 text-center sm:p-8",
        className
      )}
    >
      <div className="relative mb-6">
        <div className="flex h-20 w-20 animate-in items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/10 shadow-lg duration-300 fade-in zoom-in sm:h-24 sm:w-24">
          <ShieldAlert className="size-10 stroke-[2] text-destructive sm:size-12" />
        </div>
      </div>

      <div className="mx-auto mb-6 max-w-md space-y-2">
        <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
          {title}
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {description}
        </p>
      </div>

      {suggestion && (
        <div className="mx-auto mb-6 flex max-w-md items-start gap-2.5 rounded-xl border border-border bg-accent p-3 text-left text-xs text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>{suggestion}</span>
        </div>
      )}

      {requiredPermission && (
        <div className="mx-auto mb-6 w-full max-w-md">
          <button
            type="button"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="mx-auto mb-2 flex cursor-pointer items-center justify-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
          >
            <span>Rincian Akses Teknis</span>
            {showTechnicalDetails ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
          </button>

          {showTechnicalDetails && (
            <div className="flex animate-in items-center justify-between gap-2 rounded-xl border border-border bg-muted/40 p-3 font-mono text-xs text-muted-foreground duration-200 fade-in">
              <div className="flex items-center gap-1.5 truncate">
                <Key className="size-3.5 shrink-0 text-primary" />
                <span className="truncate">{requiredPermission}</span>
              </div>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={handleCopyPermission}
                      className="size-6 shrink-0"
                    >
                      {copied ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3 text-muted-foreground" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {copied ? "Tersalin!" : "Salin Izin"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {showBackButton && (
          <Button
            variant="outline"
            onClick={handleBack}
            className="h-9 rounded-xl px-4 text-xs font-semibold"
          >
            <ArrowLeft className="mr-1.5 size-3.5" />
            Kembali
          </Button>
        )}

        {showHomeButton && (
          <Button
            onClick={handleGoHome}
            className="h-9 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Home className="mr-1.5 size-3.5" />
            Ke Beranda
          </Button>
        )}

        {showRefreshButton && (
          <Button
            variant="ghost"
            onClick={handleRefresh}
            className="h-9 rounded-xl px-3 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="mr-1 size-3.5" />
            Muat Ulang
          </Button>
        )}

        {actionButton}
      </div>
    </div>
  )
}
