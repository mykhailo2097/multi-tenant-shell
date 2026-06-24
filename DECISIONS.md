# Decisions

Short log of the choices that shaped this MVP and why.

## Monorepo with npm workspaces

The brief allowed two repos or one monorepo. A single workspace repo keeps the
shell/theme split visible, lets the shell consume theme packages as real
dependencies (proving the boundary), and needs no extra tooling. Plain npm
workspaces over Nx/Turbo/pnpm to keep the setup boring and dependency-light.

## A third package: `@mts/theme-kit` (the contract)

The brief names `player-shell` and `theme-tenant-alpha`. A small `theme-kit`
holds the `BrandTheme` type, the `ThemeProvider`, and the fallback theme. The
contract must live somewhere both the shell and every theme can depend on
*without* depending on each other; a neutral package is the clean home, and it's
where the brand-agnostic fallback theme belongs. This is the one piece of extra
structure judged worth it — it's what makes the architecture scale to N brands.

## Tokens as scoped CSS custom properties

Each theme defines `--brand-*` variables under a class (`.theme-tenant-alpha`);
components read `var(--brand-*)`. Theming becomes a pure CSS concern, supports
runtime switching with no re-mount, and keeps branded components free of
hard-coded values. The shell applies the class via `ThemeProvider`; it never
imports the CSS — that's what keeps the token boundary intact.

## Components delivered through the theme, not imported directly

Pages call `useBrandComponents()` instead of importing `BrandButton`. This is
what guarantees "theme switch changes appearance without changing feature code":
the page references a stable interface and the active theme supplies the
implementation.

## API as injected interfaces

Pages depend on `ApiClient`/`IdentityApi`/`BillingApi` interfaces via context.
Mocks are the injected default; swapping in a real client is a provider-level
change. Mocks carry small affordances for reaching each state: `tenant-error`
throws (error), `fail@example.com` rejects login (auth error), and the empty
state is exercised in tests with a stubbed empty list. Those magic values live
as named constants in `api/mock.constants.ts`, and brand ids in `config/brands.ts`.

## One component per file + context/provider split

Files were split so each `.tsx` exports a single component:
- `BillingPage` → `InvoicesCard` + `InvoiceList` + `PaymentForm`.
- theme-kit fallback → `FallbackButton` + `FallbackCard`.
- Each context → `*.context.ts` (object + hook + constants) and
  `*Provider.tsx` (component only).

Beyond readability, keeping non-component exports out of `.tsx` files satisfies
React Fast Refresh (`react-refresh/only-export-components`) and gets the lint to
zero warnings.

## Billing loading without lint suppressions

`InvoicesCard` is keyed by `brandId` (remount resets to loading) and sets state
only inside async callbacks, so the loading/error/empty flow doesn't trip
`react-hooks/set-state-in-effect` and needs no `eslint-disable`.

## Tooling: latest majors

Pinned to current latest and mutually compatible: **Vite 8, React 19,
TypeScript 6, Vitest 4, ESLint 10 (flat config), Storybook 10**, plus
`@vitejs/plugin-react` 6 and `@stylistic/eslint-plugin` for auto-fixable
whitespace. Node ≥ 20 is required by the toolchain (`.nvmrc` pins 24).

## Styling: Tailwind CSS v4 mapped onto the brand tokens

Styling uses Tailwind v4 utilities. Crucially, Tailwind's theme is mapped onto
the existing `--brand-*` CSS variables via `@theme inline` in `global.css`
(e.g. `--color-brand-primary: var(--brand-color-primary)`), so utilities like
`bg-brand-primary` / `rounded-brand` / `shadow-brand` resolve to the active
tenant's tokens at runtime. Switching tenant still re-skins everything because
the tokens are scoped by the `.theme-*` class — Tailwind never hard-codes a
brand value. Because the theme packages live outside the app, `global.css`
declares `@source` for them so their utility classes get generated.

Base element styling (body, focus rings, inputs, labels) stays in an
`@layer base` block reading the same tokens. Tailwind's preflight resets
default margins, so spacing between elements is set explicitly with utilities.

## Storybook

Included (v10) with the a11y/axe addon for the two branded components — the
"Storybook for 1–2 UI components" and "simple accessibility checks" nice-to-haves.
`addon-essentials` is built into Storybook core in v10, so only `addon-a11y` is
listed explicitly.

## Comments

Kept intentionally minimal — names and types carry the intent. The docs
(`README`, this file, `ARCHITECTURE`) hold the explanation instead of inline
prose.

## Scope deliberately left out

- **Real auth/session persistence** — session is in-memory; no tokens/refresh.
- **Route guards** — billing is reachable without login to keep the demo
  frictionless; a `RequireAuth` wrapper is the obvious next step.
- **i18n library** — `locale`/`currency` drive `Intl.NumberFormat` only.

## If this grew

- Lazy-load theme packages by `brandId` (code-split per brand).
- Move the token contract to a typed design-tokens build (e.g. Style Dictionary).
- Generate `ApiClient` from an OpenAPI/GraphQL schema.
- Add `RequireAuth` guards and persistent sessions.
