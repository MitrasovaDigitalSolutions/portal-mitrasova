"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { formatRupiah } from "@/hooks/use-format-rupiah"
import { cn } from "@/lib/utils"
import { Calculator, Check, Delete, X } from "lucide-react"

/**
 * Safely evaluates simple math expressions:
 * Supports +, -, *, /, x, X, parentheses, and Indonesian thousand separators.
 * Returns null if invalid or incomplete.
 */
export function safeEvaluateMathExpression(input: string): number | null {
  if (!input || !input.trim()) {
    return null
  }

  let sanitized = input
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/[xX]/g, "*")
    .replace(/\s+/g, "")

  sanitized = sanitized.replace(/(\d)\.(\d{3})(?!\d)/g, "$1$2")
  sanitized = sanitized.replace(/(\d)\.(\d{3})(?!\d)/g, "$1$2")
  sanitized = sanitized.replace(/,/g, ".")

  if (!/^[\d+\-*/().]+$/.test(sanitized)) {
    return null
  }

  try {
    const result = new Function(`"use strict"; return (${sanitized});`)()
    if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
      return Math.round(result * 100) / 100
    }
    return null
  } catch {
    return null
  }
}

export interface NominalCalculatorProps {
  value?: number | null
  onApply: (val: number) => void
  disabled?: boolean
  className?: string
  align?: "start" | "center" | "end"
  side?: "top" | "bottom" | "left" | "right"
}

export function NominalCalculator({
  value,
  onApply,
  disabled = false,
  className,
  align = "end",
  side = "bottom",
}: NominalCalculatorProps) {
  const [open, setOpen] = useState(false)
  const [expression, setExpression] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      setExpression(value ? String(value) : "")
    }
  }

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.select()
        }
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [open])

  const calculatedResult = useMemo(() => {
    return safeEvaluateMathExpression(expression)
  }, [expression])

  const handleApply = () => {
    if (calculatedResult !== null) {
      onApply(calculatedResult)
      setOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleApply()
    } else if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
    }
  }

  const appendCharacter = (char: string) => {
    setExpression((prev) => prev + char)
    inputRef.current?.focus()
  }

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1))
    inputRef.current?.focus()
  }

  const handleClear = () => {
    setExpression("")
    inputRef.current?.focus()
  }

  if (disabled) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <button
            type="button"
            tabIndex={-1}
            title="Buka Kalkulator Hitung Cepat"
            className={cn(
              "flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-primary",
              open && "bg-primary/10 text-primary",
              className
            )}
          >
            <Calculator className="size-4" />
          </button>
        }
      />

      <PopoverContent
        align={align}
        side={side}
        className="z-50 w-72 animate-in space-y-3 rounded-2xl border border-border bg-popover p-3 shadow-2xl duration-100 zoom-in-95 fade-in sm:w-80"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <Calculator className="size-3.5" />
            </div>
            <span className="text-xs font-bold text-foreground">
              Kalkulator Cepat
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="cursor-pointer rounded-md p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Expression Input & Live Result Display */}
        <div className="space-y-1.5 rounded-xl border border-border bg-muted/40 p-2.5">
          <input
            ref={inputRef}
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik rumus: 1000000 + 500000..."
            className="w-full border-b border-border bg-transparent pb-1 font-mono text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          <div className="flex min-h-[22px] items-center justify-between pt-0.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">
              Hasil:
            </span>
            <span
              className={cn(
                "font-mono text-xs font-extrabold transition-colors",
                calculatedResult !== null
                  ? "font-bold text-primary"
                  : expression
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60"
              )}
            >
              {calculatedResult !== null
                ? formatRupiah(calculatedResult)
                : expression
                  ? "Menghitung..."
                  : "Rp 0"}
            </span>
          </div>
        </div>

        {/* Compact Keypad */}
        <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-destructive/10 font-bold text-destructive transition-all hover:bg-destructive/20 active:scale-95"
          >
            C
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => appendCharacter("(")}
            className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-muted font-mono text-foreground transition-all hover:bg-muted/80 active:scale-95"
          >
            (
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => appendCharacter(")")}
            className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-muted font-mono text-foreground transition-all hover:bg-muted/80 active:scale-95"
          >
            )
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => appendCharacter(" / ")}
            className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-primary/10 font-bold text-primary transition-all hover:bg-primary/20 active:scale-95"
          >
            ÷
          </button>

          {/* Numbers & Operators */}
          {["7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => appendCharacter(num)}
              className="flex h-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-card font-mono text-foreground transition-all hover:bg-muted active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => appendCharacter(" * ")}
            className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-primary/10 font-bold text-primary transition-all hover:bg-primary/20 active:scale-95"
          >
            ×
          </button>

          {["4", "5", "6"].map((num) => (
            <button
              key={num}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => appendCharacter(num)}
              className="flex h-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-card font-mono text-foreground transition-all hover:bg-muted active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => appendCharacter(" - ")}
            className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-primary/10 font-bold text-primary transition-all hover:bg-primary/20 active:scale-95"
          >
            -
          </button>

          {["1", "2", "3"].map((num) => (
            <button
              key={num}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => appendCharacter(num)}
              className="flex h-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-card font-mono text-foreground transition-all hover:bg-muted active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => appendCharacter(" + ")}
            className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-primary/10 font-bold text-primary transition-all hover:bg-primary/20 active:scale-95"
          >
            +
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => appendCharacter("0")}
            className="flex h-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-card font-mono text-foreground transition-all hover:bg-muted active:scale-95"
          >
            0
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => appendCharacter("000")}
            className="flex h-8 cursor-pointer items-center justify-center rounded-lg border border-border bg-card font-mono text-[11px] text-foreground transition-all hover:bg-muted active:scale-95"
          >
            000
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleBackspace}
            className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-muted text-foreground transition-all hover:bg-muted/80 active:scale-95"
          >
            <Delete className="size-4" />
          </button>
          <Button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleApply}
            disabled={calculatedResult === null}
            className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
          >
            <Check className="size-4 stroke-[3]" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
