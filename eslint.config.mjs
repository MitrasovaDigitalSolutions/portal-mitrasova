import { defineConfig, globalIgnores } from "eslint/config"
import nextPlugin from "@next/eslint-plugin-next"
import reactHooks from "eslint-plugin-react-hooks"
import prettier from "eslint-config-prettier/flat"
import tsEslint from "typescript-eslint"
import unusedImports from "eslint-plugin-unused-imports"

const eslintConfig = defineConfig([
  // ─── TypeScript base config ───────────────────────────────────────
  ...tsEslint.configs.recommended,

  // ─── Prettier (disable formatting rules) ──────────────────────────
  prettier,

  // ─── Global ignores ───────────────────────────────────────────────
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),

  // ─── Next.js plugin ──────────────────────────────────────────────
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },

  // ─── React Hooks rules ────────────────────────────────────────────
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // ─── Strict TypeScript & Clean Code Rules ─────────────────────────
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      // ── No `any` ──────────────────────────────────────────────────
      "@typescript-eslint/no-explicit-any": "error",

      // ── Consistent type imports ───────────────────────────────────
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: true,
          fixStyle: "separate-type-imports",
        },
      ],

      // ── Unused variables & imports ────────────────────────────────
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // ── General best practices ────────────────────────────────────
      "prefer-const": "error",
      "no-var": "error",
      "no-console": "warn",
      "no-debugger": "error",
      "no-alert": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
    },
  },

  // ─── Type definition files: relax certain rules ───────────────────
  {
    files: ["**/*.d.ts"],
    rules: {
      "unused-imports/no-unused-vars": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
    },
  },
])

export default eslintConfig
