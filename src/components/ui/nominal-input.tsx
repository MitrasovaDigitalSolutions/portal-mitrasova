"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import React, { useLayoutEffect, useRef, useState } from "react"
import { NominalCalculator } from "./nominal-calculator"

export interface NominalInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange"
> {
  value?: number | null
  onValueChange?: (val: number | null) => void
  inputRef?: React.Ref<HTMLInputElement>
  isError?: boolean
  showCalculator?: boolean
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value)
  } else if (ref && typeof ref === "object" && "current" in ref) {
    ;(ref as React.MutableRefObject<T | null>).current = value
  }
}

export function formatNominal(val: string | number | null | undefined): string {
  if (val === null || val === undefined || val === "") {
    return ""
  }
  const numStr = String(val).replace(/\D/g, "")
  if (!numStr) {
    return ""
  }
  return new Intl.NumberFormat("id-ID").format(Number(numStr))
}

export function NominalInput({
  value,
  onValueChange,
  inputRef: externalInputRef,
  isError,
  className,
  disabled,
  showCalculator = true,
  ...props
}: NominalInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (inputRef.current && cursorPosition !== null) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
      setCursorPosition(null)
    }
  }, [cursorPosition])

  const displayValue = formatNominal(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const rawValue = input.value

    if (rawValue === "") {
      onValueChange?.(null)
      return
    }

    const cleanValue = rawValue.replace(/\D/g, "")

    const selectionStart = input.selectionStart || 0
    const digitsBeforeCursor = rawValue
      .substring(0, selectionStart)
      .replace(/\D/g, "").length

    const newFormatted = formatNominal(cleanValue)

    let newSelectionStart = 0
    let digitsCount = 0
    for (let i = 0; i < newFormatted.length; i++) {
      if (digitsCount === digitsBeforeCursor) {
        break
      }
      if (/\d/.test(newFormatted[i])) {
        digitsCount++
      }
      newSelectionStart = i + 1
    }

    const parsed = cleanValue === "" ? null : Number(cleanValue)
    onValueChange?.(parsed)

    setCursorPosition(newSelectionStart)
  }

  const inputElement = (
    <Input
      ref={(node) => {
        inputRef.current = node
        setRef(externalInputRef, node)
      }}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      disabled={disabled}
      className={cn(
        "h-10 rounded-xl border-input bg-background text-xs focus-visible:ring-ring",
        showCalculator && "pr-8",
        isError && "border-destructive focus-visible:ring-destructive",
        className
      )}
      aria-invalid={!!isError}
      {...props}
    />
  )

  if (!showCalculator) {
    return inputElement
  }

  return (
    <div className="relative flex w-full items-center">
      {inputElement}
      <div className="absolute top-1/2 right-1 z-10 -translate-y-1/2">
        <NominalCalculator
          value={value}
          disabled={disabled}
          onApply={(newVal) => {
            onValueChange?.(newVal)
          }}
        />
      </div>
    </div>
  )
}
