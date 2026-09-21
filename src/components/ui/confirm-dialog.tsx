"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, Info, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
  variant?: "danger" | "warning" | "info" | "success" | "primary"
  confirmBtnId?: string
  cancelBtnId?: string
  contentId?: string
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Konfirmasi Tindakan",
  description = "Apakah Anda yakin ingin melakukan tindakan ini?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  onConfirm,
  isLoading = false,
  variant = "warning",
  confirmBtnId,
  cancelBtnId,
  contentId = "confirm-dialog-content",
}: ConfirmDialogProps) {
  const [isInternalLoading, setIsInternalLoading] = React.useState(false)
  const showLoading = isLoading || isInternalLoading

  const handleConfirm = async () => {
    setIsInternalLoading(true)
    try {
      await onConfirm()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    } finally {
      setIsInternalLoading(false)
    }
  }

  const variantStyles = {
    danger: {
      iconBg: "bg-destructive/10 text-destructive border-destructive/20",
      confirmBtn:
        "bg-destructive hover:bg-destructive/90 text-white focus-visible:ring-destructive",
      icon: AlertTriangle,
    },
    warning: {
      iconBg:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      confirmBtn:
        "bg-amber-600 hover:bg-amber-700 text-white focus-visible:ring-amber-500",
      icon: AlertTriangle,
    },
    info: {
      iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
      confirmBtn:
        "bg-sky-600 hover:bg-sky-700 text-white focus-visible:ring-sky-500",
      icon: Info,
    },
    success: {
      iconBg:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      confirmBtn:
        "bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-500",
      icon: CheckCircle2,
    },
    primary: {
      iconBg: "bg-primary/10 text-primary border-primary/20",
      confirmBtn:
        "bg-primary hover:bg-primary/90 text-primary-foreground focus-visible:ring-ring",
      icon: CheckCircle2,
    },
  }

  const style =
    (variant && variantStyles[variant as keyof typeof variantStyles]) ||
    variantStyles.warning
  const Icon = style.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id={contentId}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            handleConfirm()
          }
        }}
        className="max-w-sm animate-in gap-0 overflow-hidden rounded-2xl border-border bg-popover p-6 shadow-xl duration-100 zoom-in-95 fade-in"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon Container */}
          <div
            className={cn(
              "mb-4 flex h-12 w-12 animate-in items-center justify-center rounded-full border duration-300 zoom-in-75 fade-in",
              style.iconBg
            )}
          >
            <Icon className="size-6 stroke-[2]" />
          </div>

          <DialogHeader className="mb-2 gap-1">
            <DialogTitle className="text-base font-bold text-foreground">
              {title}
            </DialogTitle>
            <DialogDescription
              render={<div />}
              className="max-w-xs text-xs leading-normal text-muted-foreground"
            >
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Actions container */}
        <div className="mt-6 flex w-full flex-col gap-2.5 sm:flex-row">
          <Button
            id={cancelBtnId}
            type="button"
            variant="outline"
            className="order-2 h-10 w-full flex-1 cursor-pointer rounded-xl p-2 text-xs font-semibold sm:order-1 sm:w-auto"
            onClick={() => onOpenChange(false)}
            disabled={showLoading}
          >
            {cancelText}
          </Button>
          <Button
            id={confirmBtnId}
            type="button"
            className={cn(
              "order-1 flex h-10 w-full flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl p-2 text-xs font-semibold sm:order-2 sm:w-auto",
              style.confirmBtn
            )}
            onClick={handleConfirm}
            disabled={showLoading}
          >
            {showLoading && <Loader2 className="size-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
