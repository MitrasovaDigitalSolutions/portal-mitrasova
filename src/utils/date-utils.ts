import {
  format,
  subMonths,
  subDays,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  isToday as fnsIsToday,
  isYesterday as fnsIsYesterday,
  formatDistanceToNow as fnsFormatDistanceToNow,
  isValid as fnsIsValid,
} from "date-fns"
import { id } from "date-fns/locale"

/**
 * Memastikan input tanggal valid dan mengembalikannya sebagai objek Date.
 * Mengembalikan null jika tanggal tidak valid.
 */
export function parseToDate(
  dateInput?: Date | string | number | null
): Date | null {
  if (dateInput === null || dateInput === undefined) {
    return null
  }
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
  return fnsIsValid(date) ? date : null
}

/**
 * Mendapatkan range tanggal default (1 bulan yang lalu sampai hari ini).
 * Format: yyyy-MM-dd
 */
export function getDefaultDateRange(): { from: string; to: string } {
  const todayDate = new Date()
  const oneMonthAgo = subMonths(todayDate, 1)

  return {
    from: format(oneMonthAgo, "yyyy-MM-dd"),
    to: format(todayDate, "yyyy-MM-dd"),
  }
}

/**
 * Mengubah input tanggal/waktu menjadi string ISO lokal.
 */
export function toLocalISOString(
  dateInput?: Date | string | number | null
): string {
  if (dateInput === null || dateInput === "") {
    return ""
  }
  const input = dateInput ?? new Date()

  let date: Date | null = null
  if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.trim())) {
    const [year, month, day] = input.trim().split("-").map(Number)
    const now = new Date()
    date = new Date(
      year,
      month - 1,
      day,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    )
  } else {
    date = parseToDate(input)
  }

  if (!date || isNaN(date.getTime())) {
    return ""
  }

  const offsetMinutes = date.getTimezoneOffset()
  const localShiftedTime = new Date(date.getTime() - offsetMinutes * 60 * 1000)
  return localShiftedTime.toISOString()
}

/**
 * Mengembalikan objek Date hari ini.
 */
export function today(): Date {
  return new Date()
}

/**
 * Mengembalikan string tanggal hari ini dengan format yyyy-MM-dd.
 */
export function todayStr(): string {
  return format(new Date(), "yyyy-MM-dd")
}

/**
 * Mengembalikan string tanggal awal bulan ini dengan format yyyy-MM-dd.
 */
export function startOfMonthStr(): string {
  return format(startOfMonth(new Date()), "yyyy-MM-dd")
}

/**
 * Mengembalikan string tanggal N hari yang lalu dengan format yyyy-MM-dd.
 */
export function subDaysStr(days: number): string {
  return format(subDays(new Date(), days), "yyyy-MM-dd")
}

/**
 * Mengembalikan string tanggal N hari yang akan datang dengan format yyyy-MM-dd.
 */
export function addDaysStr(days: number): string {
  return format(subDays(new Date(), -days), "yyyy-MM-dd")
}

/**
 * Memformat tanggal dengan format custom (default locale Indonesia).
 */
export function formatDate(
  dateInput?: Date | string | number | null,
  formatStr: string = "dd MMM yyyy",
  options?: { useLocale?: boolean }
): string {
  const date = parseToDate(dateInput)
  if (!date) {
    return ""
  }

  return format(date, formatStr, {
    locale: options?.useLocale === false ? undefined : id,
  })
}

/**
 * Format ke tanggal lengkap yang mudah dibaca (Bahasa Indonesia).
 * Contoh: 06 Juli 2026
 */
export function formatToReadableDate(
  dateInput?: Date | string | number | null
): string {
  return formatDate(dateInput, "dd MMMM yyyy")
}

/**
 * Format ke tanggal & waktu lengkap yang mudah dibaca (Bahasa Indonesia).
 * Contoh: 06 Juli 2026, 08:44
 */
export function formatToReadableDateTime(
  dateInput?: Date | string | number | null
): string {
  return formatDate(dateInput, "dd MMMM yyyy, HH:mm")
}

/**
 * Format ke waktu saja.
 */
export function formatToTime(
  dateInput?: Date | string | number | null,
  includeSeconds = false
): string {
  return formatDate(dateInput, includeSeconds ? "HH:mm:ss" : "HH:mm")
}

/**
 * Format ke format ISO sederhana (yyyy-MM-dd).
 */
export function formatToISO(dateInput?: Date | string | number | null): string {
  return formatDate(dateInput, "yyyy-MM-dd", { useLocale: false })
}

/**
 * Memformat jarak waktu relatif ke Bahasa Indonesia.
 */
export function formatRelative(
  dateInput?: Date | string | number | null
): string {
  const date = parseToDate(dateInput)
  if (!date) {
    return ""
  }

  return fnsFormatDistanceToNow(date, {
    locale: id,
    addSuffix: true,
  })
}

/**
 * Mengecek apakah tanggal adalah hari ini.
 */
export function isToday(dateInput?: Date | string | number | null): boolean {
  const date = parseToDate(dateInput)
  return date ? fnsIsToday(date) : false
}

/**
 * Mengecek apakah tanggal adalah kemarin.
 */
export function isYesterday(
  dateInput?: Date | string | number | null
): boolean {
  const date = parseToDate(dateInput)
  return date ? fnsIsYesterday(date) : false
}

/**
 * Mengembalikan range tanggal hari ini dalam format yyyy-MM-dd.
 */
export function getTodayRange(): { from: string; to: string } {
  const dateStr = todayStr()
  return { from: dateStr, to: dateStr }
}

/**
 * Mengembalikan range tanggal kemarin dalam format yyyy-MM-dd.
 */
export function getYesterdayRange(): { from: string; to: string } {
  const yesterday = subDays(new Date(), 1)
  const dateStr = format(yesterday, "yyyy-MM-dd")
  return { from: dateStr, to: dateStr }
}

/**
 * Mengembalikan range tanggal minggu ini dalam format yyyy-MM-dd.
 */
export function getThisWeekRange(): { from: string; to: string } {
  const todayDate = new Date()
  const start = startOfWeek(todayDate, { weekStartsOn: 1 })
  return {
    from: format(start, "yyyy-MM-dd"),
    to: format(todayDate, "yyyy-MM-dd"),
  }
}

/**
 * Mengembalikan range tanggal bulan ini dalam format yyyy-MM-dd.
 */
export function getThisMonthRange(): { from: string; to: string } {
  const todayDate = new Date()
  const start = startOfMonth(todayDate)
  return {
    from: format(start, "yyyy-MM-dd"),
    to: format(todayDate, "yyyy-MM-dd"),
  }
}

/**
 * Mengembalikan range tanggal bulan lalu secara penuh dalam format yyyy-MM-dd.
 */
export function getLastMonthRange(): { from: string; to: string } {
  const todayDate = new Date()
  const firstOfLastMonth = startOfMonth(subMonths(todayDate, 1))
  const lastOfLastMonth = endOfMonth(subMonths(todayDate, 1))
  return {
    from: format(firstOfLastMonth, "yyyy-MM-dd"),
    to: format(lastOfLastMonth, "yyyy-MM-dd"),
  }
}

/**
 * Mengembalikan range tanggal N hari terakhir dalam format yyyy-MM-dd.
 */
export function getLastDaysRange(days: number): { from: string; to: string } {
  const todayDate = new Date()
  const start = subDays(todayDate, days - 1)
  return {
    from: format(start, "yyyy-MM-dd"),
    to: format(todayDate, "yyyy-MM-dd"),
  }
}
