<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Portal Mitrasova — Coding Conventions & Agent Rules

> All AI agents and developers **MUST** read and follow these rules before writing any code.
> These conventions are non-negotiable and are enforced via ESLint, TypeScript strict mode, and code review.

---

## 1. Core Principles

### SOLID

| Principle | Rule |
| :--- | :--- |
| **S** — Single Responsibility | Every file, function, and component does **one thing only**. No god components, no god files. |
| **O** — Open/Closed | Use composition and props/generics to extend behavior. Never modify existing working abstractions to add features. |
| **L** — Liskov Substitution | Derived components must be fully substitutable for their base types. |
| **I** — Interface Segregation | Keep type interfaces small and focused. Prefer many specific types over one large type. |
| **D** — Dependency Inversion | Depend on abstractions (types/interfaces), not concrete implementations. API clients, stores, and services must be injectable/mockable. |

### DRY (Don't Repeat Yourself)

- Extract shared logic into custom hooks (`hooks/`), utility functions (`utils/`), or shared components (`components/shared/`).
- Constants that appear in more than one place must go into `constants/`.
- Shared Zod schemas go to `lib/validations/`.
- If you copy-paste code, you are doing it wrong.

### Clean Code

- **Naming**: Descriptive, unambiguous names. No abbreviations except universally understood ones (e.g., `id`, `url`, `api`).
- **Functions**: Max ~20-30 lines. If longer, extract sub-functions.
- **Components**: Max ~100-150 lines of JSX+logic. If longer, decompose.
- **No magic numbers/strings**: Use named constants.
- **No nested ternaries**: Use early returns or extracted variables.
- **No `console.log` in production code**: Use proper logging utilities if needed.

---

## 2. TypeScript Rules (STRICT)

- **`strict: true`** is mandatory in `tsconfig.json`.
- **NEVER use `any`**. Use `unknown` and narrow with type guards, or define proper types.
- **NEVER use `@ts-ignore` or `@ts-expect-error`** without a linked issue/comment explaining why.
- **NEVER use non-null assertions (`!`)** unless the value is provably non-null.
- All function parameters and return types must be explicitly typed (except when inference is obvious for internal helpers).
- Prefer `interface` for object shapes that may be extended. Use `type` for unions, intersections, and computed types.
- All type definitions go in `.d.ts` files inside `@types/` folders.

---

## 3. Project Structure

```
src/
├── app/                              # Next.js App Router (pages & layouts only)
│   ├── (auth)/                       # Route group: authentication pages
│   ├── (dashboard)/                  # Route group: dashboard pages
│   ├── api/                          # Next.js API route handlers
│   ├── globals.css                   # Global styles & Tailwind theme
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Root page
│
├── @types/                           # Global type definitions (.d.ts files)
│   ├── api.d.ts                      # Shared API response/request types
│   ├── common.d.ts                   # Common utility types
│   └── index.d.ts                    # Re-exports
│
├── components/                       # Shared/global components
│   ├── ui/                           # shadcn/ui primitive components (auto-generated)
│   ├── providers/                    # React context providers
│   └── shared/                       # Reusable composed components (e.g., DataTable, Modal)
│
├── constants/                        # Global constants & enums
│   └── index.ts
│
├── features/                         # Feature-based modules ★
│   └── [feature-name]/
│       ├── @types/                   # Feature-specific types (.d.ts)
│       │   └── [feature].d.ts
│       ├── api/                      # Feature API calls & TanStack Query hooks
│       │   ├── [feature].api.ts      # Axios API functions
│       │   └── [feature].queries.ts  # useQuery / useMutation hooks
│       ├── components/               # Feature-specific UI components
│       │   └── [component-name].tsx
│       ├── hooks/                    # Feature-specific custom hooks
│       ├── utils/                    # Feature-specific utilities
│       ├── constants/                # Feature-specific constants
│       ├── stores/                   # Feature-specific Zustand stores
│       └── validations/              # Feature-specific Zod schemas
│
├── hooks/                            # Global shared custom hooks
│
├── lib/                              # Library configurations & core utilities
│   ├── axios.ts                      # Axios instance with interceptors
│   ├── auth.ts                       # NextAuth configuration
│   ├── utils.ts                      # General utilities (cn, etc.)
│   └── validations/                  # Shared Zod schemas
│
├── stores/                           # Global Zustand stores
│
└── utils/                            # Global utility functions
```

### Folder Rules

1. **`app/`** contains **ONLY** Next.js routing files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, and API route handlers. **No business logic, no components, no hooks.**
2. **`features/`** is the heart of the codebase. Every domain feature gets its own folder with a consistent internal structure.
3. **`components/ui/`** is managed by shadcn CLI. Do NOT manually edit files here.
4. **`components/shared/`** is for reusable composed components that are used across multiple features.
5. **`@types/`** folders contain ONLY `.d.ts` files. Never put runtime code here.
6. **Every folder** that exports multiple items must have an `index.ts` barrel file for clean imports.

---

## 4. Naming Conventions

| Item | Convention | Example |
| :--- | :--- | :--- |
| Files (components) | `kebab-case.tsx` | `user-profile-card.tsx` |
| Files (hooks) | `use-[name].ts` | `use-auth.ts` |
| Files (utils) | `kebab-case.ts` | `format-date.ts` |
| Files (api) | `[feature].api.ts` | `product.api.ts` |
| Files (queries) | `[feature].queries.ts` | `product.queries.ts` |
| Files (stores) | `[feature].store.ts` | `cart.store.ts` |
| Files (validations) | `[feature].schema.ts` | `product.schema.ts` |
| Files (types) | `[feature].d.ts` | `product.d.ts` |
| Files (constants) | `kebab-case.ts` or `index.ts` | `api-endpoints.ts` |
| Components | `PascalCase` | `UserProfileCard` |
| Hooks | `camelCase` with `use` prefix | `useAuth` |
| Types/Interfaces | `PascalCase` | `ProductResponse` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_PAGE_SIZE` |
| Enums | `PascalCase` (members: `PascalCase`) | `UserRole.Admin` |
| Zustand stores | `use[Name]Store` | `useCartStore` |
| Query keys | `[feature]Keys` | `productKeys` |
| API functions | `camelCase` verb-first | `getProducts`, `createOrder` |

---

## 5. Component Rules

- **No god components.** If a component exceeds ~150 lines, decompose it.
- Every component must have a clear, single responsibility.
- **Always prioritize Reusable Components**: Selalu gunakan komponen reusable yang sudah tersedia di `@/components/forms/`, `@/components/ui/`, atau `@/components/shared/` (seperti `FormInput`, `FormSelect`, `FormDatePicker`, `FormNominalInput`, `FormTextarea`, `FormSwitch`, `BaseDialog`, `ConfirmDialog`, `DataTable`, `NominalInput`, dll.) daripada menggunakan HTML primitives (`<input>`, `<select>`, dll.) atau membuat komponen ad-hoc baru. Komponen baru hanya dibuat jika memang tidak ada abstraksi reusable yang sesuai.
- **Server Components** are the default in Next.js App Router. Only add `"use client"` when the component genuinely needs client-side interactivity (hooks, event handlers, browser APIs).
- Prefer composition over prop drilling. Use React Context or Zustand for deeply shared state.
- All props must be typed via an `interface` or `type`, defined in the feature's `@types/` folder.
- Use `forwardRef` for components that wrap native elements.

---

## 6. API & Data Fetching Rules

- **All HTTP calls** go through the shared Axios instance in `lib/axios.ts`.
- **All server state** is managed via TanStack Query. No `useEffect` + `useState` for data fetching.
- Query hooks live in `features/[name]/api/[name].queries.ts`.
- Raw API functions live in `features/[name]/api/[name].api.ts`.
- API response types are defined in `features/[name]/@types/`.
- Use query key factories for consistent cache management.

---

## 7. State Management Rules

- **Server state** → TanStack Query (queries, mutations, cache).
- **Global client state** → Zustand stores in `stores/` or `features/[name]/stores/`.
- **Local UI state** → `useState` / `useReducer` inside the component.
- **Form state** → React Hook Form + Zod validation.
- **NEVER** duplicate server state into client state.

---

## 8. Form & Validation Rules

- All forms use `react-hook-form` with `zodResolver`.
- Wrap forms in `<FormProvider>` when utilizing reusable form inputs (`FormInput`, `FormSelect`, `FormDatePicker`, `FormNominalInput`, `FormTextarea`, `FormSwitch`).
- **Use `useWatch` instead of `watch`**: Selalu gunakan `useWatch({ control, name })` untuk mengamati nilai field alih-alih `watch(...)` di root form. Ini meminimalkan re-render komponen induk dan mencegah masalah dependency referensi pada hook `useMemo` / `useEffect`.
- Zod schemas live in `features/[name]/validations/` or `lib/validations/` for shared schemas.
- Form types are inferred from Zod schemas using `z.infer<typeof schema>`. Pastikan tipe input dan output Zod selaras agar tidak terjadi error generic pada resolver.
- Validation error messages must be user-friendly and in Bahasa Indonesia when user-facing.

---

## 9. Import Order

Imports must follow this order (enforced by ESLint):

```ts
// 1. React / Next.js
import { useState } from "react"
import Link from "next/link"

// 2. Third-party libraries
import { useQuery } from "@tanstack/react-query"
import { z } from "zod"

// 3. Internal aliases (@/)
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks/use-auth"

// 4. Relative imports (same feature/module)
import { ProductCard } from "./components/product-card"
import { PRODUCT_STATUS } from "./constants"
```

---

## 10. ESLint & Formatting

- ESLint is configured in `eslint.config.mjs` with **strict** rules.
- Prettier handles formatting (config in `.prettierrc`).
- **Zero tolerance** for ESLint errors. Warnings are treated as errors in CI.
- Run `bun run lint` before committing. Run `bun run format` to auto-fix formatting.

### Key ESLint Rules

- `no-explicit-any` → **error**
- `no-unused-vars` → **error** (auto-removed by `unused-imports` plugin)
- `no-console` → **warn** (error in production builds)
- `consistent-type-imports` → **error** (use `import type`)
- `prefer-const` → **error**
- `no-var` → **error**

---

## 11. Git & Commit Conventions

- Branch naming: `feature/[feature-name]`, `fix/[bug-name]`, `refactor/[scope]`
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: add product listing page`
  - `fix: resolve cart total calculation`
  - `refactor: extract shared data table component`
  - `chore: update eslint configuration`

---

## 12. Checklist Before Writing Code

- [ ] Read this `AGENTS.md` file
- [ ] Check `node_modules/next/dist/docs/` for Next.js API guidance
- [ ] Identify which feature folder the code belongs to
- [ ] Check for existing reusable components in `components/forms/`, `components/ui/`, `components/shared/` before creating new ones
- [ ] Define types in `@types/` first
- [ ] Write Zod schemas for any data validation
- [ ] Use `useWatch` instead of `watch` for observing form field values
- [ ] Create query key factory before writing query hooks
- [ ] Ensure no `any`, no unused imports, no god components
- [ ] Run `bun run typecheck && bun run lint` after changes
