import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & React.ComponentProps<"button">

const PaginationLink = ({
  className,
  isActive,
  disabled,
  ...props
}: PaginationLinkProps) => (
  <button
    aria-current={isActive ? "page" : undefined}
    disabled={disabled}
    className={cn(
      buttonVariants({
        variant: isActive ? "default" : "ghost",
        size: "icon-sm",
      }),
      "cursor-pointer rounded-xl text-xs transition-all select-none disabled:pointer-events-none disabled:opacity-40",
      isActive
        ? "border border-transparent bg-primary font-bold text-primary-foreground shadow-2xs hover:bg-primary/90 hover:text-primary-foreground"
        : "border border-transparent font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
      className
    )}
    type="button"
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn(
      "h-8 w-auto gap-1.5 rounded-xl border border-border/80 bg-card px-3 text-xs font-medium shadow-2xs transition-all hover:bg-muted hover:text-foreground",
      className
    )}
    {...props}
  >
    <ChevronLeft className="size-3.5" />
    <span>Sebelumnya</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn(
      "h-8 w-auto gap-1.5 rounded-xl border border-border/80 bg-card px-3 text-xs font-medium shadow-2xs transition-all hover:bg-muted hover:text-foreground",
      className
    )}
    {...props}
  >
    <span>Selanjutnya</span>
    <ChevronRight className="size-3.5" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn(
      "flex h-8 w-8 items-center justify-center text-muted-foreground",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="size-3.5" />
    <span className="sr-only">Halaman lainnya</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
