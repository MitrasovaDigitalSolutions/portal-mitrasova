"use client"

import type * as React from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Scrollable } from "@/components/ui/scrollable"

export interface BaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Icon + title shown in the header */
  title?: React.ReactNode
  /** Optional extra content to render on the right side of the header */
  headerRight?: React.ReactNode
  /** Dialog panel max-width & misc classes */
  className?: string
  children: React.ReactNode
  /** Prevent closing via the X button */
  showCloseButton?: boolean
  /** Enable scrollable content inside the dialog body */
  scrollable?: boolean
  contentId?: string
  closeBtnId?: string
  /** Prevent closing when clicking outside or focus leaves the dialog */
  disablePointerDismissal?: boolean
}

export function BaseDialog({
  open,
  onOpenChange,
  title,
  headerRight,
  className,
  children,
  showCloseButton = true,
  scrollable = true,
  contentId,
  closeBtnId,
}: BaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id={contentId}
        className={cn(
          "flex max-h-[90vh] flex-col rounded-2xl border-border bg-popover p-4 shadow-2xl sm:p-6",
          className
        )}
        showCloseButton={false}
      >
        {/* Symmetric Header */}
        {title && (
          <div className="flex shrink-0 items-center justify-between border-b border-border pb-3">
            <DialogTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
              {title}
            </DialogTitle>

            <div className="flex items-center gap-2">
              {headerRight}
              {showCloseButton && (
                <DialogClose
                  id={closeBtnId}
                  className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                  <span className="sr-only">Tutup</span>
                </DialogClose>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        {scrollable ? (
          <Scrollable
            className="max-h-[calc(90vh-100px)] min-h-0 flex-1"
            scrollbarClassName="z-40"
          >
            {children}
          </Scrollable>
        ) : (
          children
        )}
      </DialogContent>
    </Dialog>
  )
}
