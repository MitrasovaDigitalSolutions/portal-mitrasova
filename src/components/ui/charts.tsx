"use client"

import React, { useMemo } from "react"

// ─── 1. Sparkline Component ──────────────────────────────────────────────────
interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  fillColor?: string
}

export function Sparkline({
  data,
  width = 100,
  height = 40,
  color = "var(--primary)",
  fillColor: _fillColor = "rgba(0, 0, 0, 0.05)",
}: SparklineProps) {
  const points = useMemo(() => {
    if (!data || data.length < 2) {
      return ""
    }
    const max = Math.max(...data) || 1
    const min = Math.min(...data)
    const range = max - min || 1

    return data
      .map((val, index) => {
        const x = (index / (data.length - 1)) * width
        const y = height - ((val - min) / range) * (height - 6) - 3
        return `${x},${y}`
      })
      .join(" ")
  }, [data, width, height])

  const fillPoints = useMemo(() => {
    if (!points) {
      return ""
    }
    return `0,${height} ${points} ${width},${height}`
  }, [points, width, height])

  if (!data || data.length < 2) {
    return null
  }

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon
        points={fillPoints}
        fill="url(#sparkline-grad)"
        className="text-primary"
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

// ─── 2. BarChart Component ────────────────────────────────────────────────────
interface BarChartItem {
  label: string
  value: number
  pattern?: boolean
}

interface BarChartProps {
  data: BarChartItem[]
  height?: number
  barColor?: string
}

export function BarChart({ data, height = 180 }: BarChartProps) {
  const max = useMemo(() => {
    return Math.max(...data.map((d) => d.value)) || 1
  }, [data])

  return (
    <div
      className="flex w-full flex-col justify-end"
      style={{ height: `${height}px` }}
    >
      <div className="flex h-full w-full items-end justify-between gap-2 px-1">
        {data.map((item, index) => {
          const percentage = (item.value / max) * 100
          const barHeight = item.value > 0 ? Math.max(8, percentage) : 0

          return (
            <div
              key={index}
              className="group flex h-full flex-grow flex-col items-center justify-end gap-1.5"
            >
              <div className="relative flex h-full w-full flex-col items-center justify-end">
                {/* Value tooltip on hover */}
                <span className="absolute -top-7 z-10 scale-0 rounded bg-foreground px-1.5 py-1 text-[9px] font-bold whitespace-nowrap text-background shadow transition-all group-hover:scale-100">
                  {item.value.toLocaleString("id-ID")}
                </span>

                {/* Bar */}
                <div
                  style={{ height: `${barHeight}%` }}
                  className="relative w-8 overflow-hidden rounded-t-lg bg-primary transition-all duration-500 sm:w-10"
                >
                  {item.pattern ? (
                    <div
                      className="absolute inset-0 h-full rounded-t-lg border-x border-t border-border"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, rgba(255,255,255,0.15), rgba(255,255,255,0.15) 4px, transparent 4px, transparent 8px)",
                      }}
                    />
                  ) : null}
                  {barHeight > 25 && (
                    <span className="absolute right-0 bottom-2 left-0 text-center text-[8px] font-bold text-primary-foreground/90">
                      {item.value >= 1000
                        ? `${(item.value / 1000).toFixed(1)}k`
                        : item.value}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── 3. DoughnutChart Component ───────────────────────────────────────────────
interface DoughnutSegment {
  label: string
  value: number
  color: string
}

interface DoughnutChartProps {
  data: DoughnutSegment[]
  size?: number
  strokeWidth?: number
  centerValue?: string
  centerLabel?: string
  centerBadge?: string
}

export function DoughnutChart({
  data,
  size = 160,
  strokeWidth = 18,
  centerValue,
  centerLabel,
  centerBadge,
}: DoughnutChartProps) {
  const total = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0) || 1
  }, [data])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const segments = useMemo(() => {
    return data.map((seg, index) => {
      const percentage = seg.value / total
      const strokeLength = percentage * circumference

      const previousTotalLength = data
        .slice(0, index)
        .reduce((sum, s) => sum + (s.value / total) * circumference, 0)

      const strokeOffset = circumference - strokeLength - previousTotalLength

      return {
        ...seg,
        strokeLength,
        strokeOffset,
      }
    })
  }, [data, total, circumference])

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          className="text-muted/40"
          strokeWidth={strokeWidth}
        />
        {segments.map((seg, idx) => (
          <circle
            key={idx}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={seg.strokeOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        ))}
      </svg>

      <div className="absolute flex flex-col items-center px-4 text-center">
        {centerValue && (
          <span className="text-xl leading-none font-bold tracking-tight text-foreground">
            {centerValue}
          </span>
        )}
        {centerBadge && (
          <span className="mt-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
            {centerBadge}
          </span>
        )}
        {centerLabel && (
          <span className="mt-1 text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
            {centerLabel}
          </span>
        )}
      </div>
    </div>
  )
}
