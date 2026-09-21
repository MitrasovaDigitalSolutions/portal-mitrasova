# Features Directory

This directory contains feature-based modules. Each feature has its own self-contained folder structure:

```
features/
└── [feature-name]/
    ├── @types/                   # Feature-specific types (.d.ts)
    │   └── [feature].d.ts
    ├── api/                      # API calls & TanStack Query hooks
    │   ├── [feature].api.ts      # Raw Axios API functions
    │   └── [feature].queries.ts  # useQuery / useMutation hooks
    ├── components/               # Feature-specific UI components
    ├── hooks/                    # Feature-specific custom hooks
    ├── utils/                    # Feature-specific utilities
    ├── constants/                # Feature-specific constants
    ├── stores/                   # Feature-specific Zustand stores
    └── validations/              # Feature-specific Zod schemas
```

## Rules

1. A feature folder is **self-contained** — it owns its types, components, hooks, API layer, and state.
2. Cross-feature imports are done via `@/features/[other-feature]/...` — never relative paths between features.
3. Shared code used by 2+ features should be lifted to `src/components/shared/`, `src/hooks/`, `src/utils/`, or `src/lib/`.
