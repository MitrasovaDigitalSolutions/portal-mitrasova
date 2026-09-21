"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useUIStore } from "@/stores/ui-store"
import { AlertTriangle } from "lucide-react"

/**
 * Global confirm dialog — replaces native confirm() calls.
 * State is managed by the UI store (Zustand).
 * Mount this once in the root layout or providers.
 */
export function ConfirmDialog() {
  const { confirmDialog, closeConfirmDialog } = useUIStore()
  const { isOpen, title, description, onConfirm, variant } = confirmDialog

  const handleConfirm = () => {
    onConfirm?.()
    closeConfirmDialog()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && closeConfirmDialog()}
    >
      <DialogContent className="max-w-sm rounded-2xl border-border bg-card p-6 shadow-xl">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
            <AlertTriangle
              size={20}
              className={
                variant === "destructive"
                  ? "text-destructive"
                  : "text-amber-500"
              }
            />
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>

        <p className="pt-4 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button
            onClick={closeConfirmDialog}
            variant="outline"
            className="h-10 cursor-pointer rounded-xl border-border bg-background text-xs font-semibold text-foreground hover:bg-muted"
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            className={`h-10 cursor-pointer rounded-xl text-xs font-semibold transition-all ${
              variant === "destructive"
                ? "text-destructive-foreground bg-destructive hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            Konfirmasi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
