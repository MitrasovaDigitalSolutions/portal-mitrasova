"use client"

import { useState, useMemo } from "react"
import {
  useFormContext,
  Controller,
  type FieldPath,
  type FieldValues,
  type FieldError,
  type FieldErrors,
} from "react-hook-form"
import {
  CommandSelect,
  type CommandOption,
} from "@/components/ui/command-select"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

export interface AsyncQueryParams {
  search?: string
  page?: number
  per_page?: number
}

export interface AsyncQueryResult<TData = unknown> {
  data?: { pages?: { data?: TData[] }[] } | unknown
  isLoading: boolean
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  fetchNextPage?: () => void
}

export interface FormSelectProps<T extends FieldValues, TData = unknown> {
  id?: string
  name: FieldPath<T>
  label?: string
  options?: CommandOption[]
  useAsyncQuery?: (params: AsyncQueryParams) => AsyncQueryResult<TData>
  mapOption?: (item: TData) => CommandOption
  getExtraOption?: (value: string) => CommandOption | undefined
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  isLoading?: boolean
  onSearchChange?: (search: string) => void
  onScrollBottom?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
  onChange?: (value: string) => void
  className?: string
  wrapperClassName?: string
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  maxLabelLength?: number
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
  onCreateOption?: (searchQuery: string) => void
  createOptionLabel?: string
}

const defaultAsyncHook = (): AsyncQueryResult => ({
  data: undefined,
  isLoading: false,
  isFetchingNextPage: false,
  hasNextPage: false,
  fetchNextPage: () => {},
})

export function FormSelect<T extends FieldValues, TData = unknown>({
  id,
  name,
  label,
  options,
  useAsyncQuery,
  mapOption,
  getExtraOption,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  isLoading,
  onSearchChange,
  onScrollBottom,
  hasMore,
  isLoadingMore,
  onChange,
  className,
  wrapperClassName,
  disabled,
  size = "md",
  maxLabelLength,
  leftIcon,
  rightElement,
  onCreateOption,
  createOptionLabel,
}: FormSelectProps<T, TData>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const [internalSearch, setInternalSearch] = useState("")
  const debouncedSearch = useDebounce(internalSearch, 400)

  const queryHook = useAsyncQuery || defaultAsyncHook
  const asyncResult = queryHook({
    search: debouncedSearch || undefined,
    per_page: 10,
  })

  const asyncData = asyncResult?.data

  const computedOptions = useMemo(() => {
    if (useAsyncQuery && mapOption && asyncData) {
      const dataObj = asyncData as {
        pages?: { data?: TData[] }[]
        data?: TData[]
      }
      const pages =
        dataObj.pages ||
        (Array.isArray(asyncData) ? [asyncData] : [dataObj.data])
      const items: TData[] = pages.flatMap((p: unknown) => {
        if (
          p &&
          typeof p === "object" &&
          "data" in p &&
          Array.isArray((p as { data: unknown }).data)
        ) {
          return (p as { data: TData[] }).data
        }
        if (Array.isArray(p)) {
          return p as TData[]
        }
        return []
      })
      return items.map(mapOption)
    }
    return options || []
  }, [useAsyncQuery, mapOption, asyncData, options])

  const effectiveIsLoading =
    isLoading || (useAsyncQuery ? asyncResult.isLoading : false)
  const effectiveIsLoadingMore =
    isLoadingMore || (useAsyncQuery ? !!asyncResult.isFetchingNextPage : false)
  const effectiveHasMore =
    hasMore !== undefined
      ? hasMore
      : useAsyncQuery
        ? !!asyncResult.hasNextPage
        : false

  const isAsyncMode = !!useAsyncQuery || !!onSearchChange

  const handleSearchChange = (val: string) => {
    if (useAsyncQuery) {
      setInternalSearch(val)
    }
    if (onSearchChange) {
      onSearchChange(val)
    }
  }

  const handleScrollBottom = () => {
    if (
      useAsyncQuery &&
      asyncResult.fetchNextPage &&
      asyncResult.hasNextPage &&
      !asyncResult.isFetchingNextPage
    ) {
      asyncResult.fetchNextPage()
    }
    if (onScrollBottom) {
      onScrollBottom()
    }
  }

  const getNestedValue = (
    obj: FieldErrors<T>,
    path: string
  ): FieldError | undefined => {
    const value = path
      .split(/[.[\]]+/)
      .filter(Boolean)
      .reduce<unknown>((prev, curr) => {
        if (prev && typeof prev === "object") {
          return (prev as Record<string, unknown>)[curr]
        }
        return undefined
      }, obj)
    return value as FieldError | undefined
  }

  const error = getNestedValue(errors, name)

  return (
    <div id={id} className={cn("space-y-1.5", wrapperClassName)}>
      {label && (
        <label
          htmlFor={name}
          className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase"
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const fieldValueStr =
            field.value !== undefined && field.value !== null
              ? String(field.value)
              : ""

          const rawOptions = [...computedOptions]
          if (
            fieldValueStr &&
            !rawOptions.some((opt) => opt.value === fieldValueStr)
          ) {
            if (getExtraOption) {
              const extraOpt = getExtraOption(fieldValueStr)
              if (extraOpt) {
                rawOptions.unshift(extraOpt)
              }
            }
          }

          const uniqueOptionsMap = new Map<string, CommandOption>()
          rawOptions.forEach((opt) => {
            if (!uniqueOptionsMap.has(opt.value)) {
              uniqueOptionsMap.set(opt.value, opt)
            }
          })
          const finalOptions = Array.from(uniqueOptionsMap.values())

          return (
            <CommandSelect
              options={finalOptions}
              value={fieldValueStr}
              onChange={(val) => {
                const originalValue = field.value
                if (typeof originalValue === "number") {
                  field.onChange(val === "" ? "" : Number(val))
                } else {
                  field.onChange(val)
                }
                if (onChange) {
                  onChange(val)
                }
              }}
              placeholder={placeholder}
              searchPlaceholder={searchPlaceholder}
              emptyMessage={emptyMessage}
              isLoading={effectiveIsLoading}
              onSearchChange={isAsyncMode ? handleSearchChange : undefined}
              disableLocalFilter={isAsyncMode}
              onScrollBottom={handleScrollBottom}
              hasMore={effectiveHasMore}
              isLoadingMore={effectiveIsLoadingMore}
              className={cn(
                error &&
                  "border-destructive focus:border-destructive focus:ring-destructive/20",
                className
              )}
              disabled={disabled}
              size={size}
              maxLabelLength={maxLabelLength}
              leftIcon={leftIcon}
              rightElement={rightElement}
              onCreateOption={onCreateOption}
              createOptionLabel={createOptionLabel}
            />
          )
        }}
      />
      {error && (
        <p className="text-[10px] font-medium text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}
