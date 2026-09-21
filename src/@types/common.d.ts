/**
 * Common utility types used across the entire application.
 */

/** Makes specific keys of T required while keeping the rest unchanged. */
type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/** Makes specific keys of T optional while keeping the rest unchanged. */
type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/** Extracts the resolved type from a Promise. */
type Awaited<T> = T extends Promise<infer U> ? U : T

/** A nullable type helper. */
type Nullable<T> = T | null

/** Ensures at least one property of T is present. */
type AtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

/** Generic record with string keys and typed values. */
type StringRecord<T = string> = Record<string, T>

/** Component props helper with optional children. */
type PropsWithClassName = {
  className?: string
}
