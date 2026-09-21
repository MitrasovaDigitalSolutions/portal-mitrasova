"use client"

import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type DataTableActionVariant =
  | "primary"
  | "emerald"
  | "amber"
  | "rose"
  | "sky"
  | "indigo"
  | "slate"
  | "solidPrimary"
  | "solidRose"

const ACTION_VARIANT_CLASSES: Record<DataTableActionVariant, string> = {
  primary:
    "text-primary bg-primary/10 border-primary/20 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground hover:border-primary dark:hover:border-primary",
  solidPrimary:
    "text-primary-foreground bg-primary border-primary hover:bg-primary/90 shadow-2xs font-bold",
  emerald:
    "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white hover:border-emerald-600 dark:hover:border-emerald-600",
  amber:
    "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white hover:border-amber-600 dark:hover:border-amber-600",
  rose:
    "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white hover:border-rose-600 dark:hover:border-rose-600",
  solidRose:
    "text-white bg-destructive border-destructive hover:bg-destructive/90 shadow-2xs font-bold",
  sky:
    "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600 dark:hover:text-white hover:border-sky-600 dark:hover:border-sky-600",
  indigo:
    "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white hover:border-indigo-600 dark:hover:border-indigo-600",
  slate:
    "text-muted-foreground bg-muted border-border hover:bg-foreground hover:text-background dark:hover:bg-foreground dark:hover:text-background hover:border-foreground dark:hover:border-foreground",
}

export interface DataTableActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DataTableActionVariant
  tooltip?: React.ReactNode
  children: React.ReactNode
}

export const DataTableActionButton = React.forwardRef<
  HTMLButtonElement,
  DataTableActionButtonProps
>(
  (
    {
      variant = "primary",
      tooltip,
      className,
      disabled,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const btn = (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "flex shrink-0 cursor-pointer items-center justify-center rounded-xl border p-1.5 shadow-2xs transition-all active:scale-95 [&>svg]:text-current [&>svg]:transition-colors",
          ACTION_VARIANT_CLASSES[variant],
          disabled &&
            "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-current active:scale-100",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )

    if (!tooltip) {
      return btn
    }

    return (
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>{btn}</TooltipTrigger>
          <TooltipContent
            side="top"
            className="px-2 py-0.5 text-[10px] font-semibold"
          >
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
)
DataTableActionButton.displayName = "DataTableActionButton"

export interface DataTableTextActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost"
  icon?: React.ReactNode
  children: React.ReactNode
}

export const DataTableTextActionButton = React.forwardRef<
  HTMLButtonElement,
  DataTableTextActionButtonProps
>(({ variant = "outline", icon, children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all",
        variant === "primary" &&
          "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "secondary" &&
          "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
        variant === "destructive" &&
          "border-destructive bg-destructive text-white hover:bg-destructive/90",
        variant === "outline" &&
          "border-border bg-background text-foreground hover:bg-muted",
        variant === "ghost" &&
          "border-transparent bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  )
})
DataTableTextActionButton.displayName = "DataTableTextActionButton"
