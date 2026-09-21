import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-auto w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border px-2.5 py-0.5 text-[10px] leading-none font-extrabold whitespace-nowrap shadow-2xs transition-all select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",
        danger:
          "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400",
        warning:
          "border-amber-500/20 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400",
        info: "border-sky-500/20 bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 dark:text-sky-400",
        sky: "border-sky-500/20 bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 dark:text-sky-400",
        purple:
          "border-indigo-500/20 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 dark:text-indigo-400",
        cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20 dark:text-cyan-400",
        outline:
          "border-border text-foreground hover:bg-muted dark:border-input",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
