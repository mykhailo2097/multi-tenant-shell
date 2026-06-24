# Architecture

## Goal

A reusable shell that hosts product features once, and brand themes that change
appearance without touching those features. Adding a brand should be additive
(a new package + one registry entry), never a refactor.

## Packages and dependency direction

```
apps/player-shell ──► themes/theme-tenant-alpha ──► packages/theme-kit
        │                                               ▲
        └───────────────────────────────────────────────┘
```

- **`packages/theme-kit`** — the *contract*. Defines `BrandTheme`, the
  `ThemeProvider`/`useTheme`/`useBrandComponents` runtime, and the **fallback
  theme** (`FallbackButton`, `FallbackCard`). Knows nothing about any tenant.
- **`themes/theme-tenant-alpha`** — a *theme implementation*. Depends only on
  `theme-kit`. Ships `tokens.css` (design tokens as CSS custom properties) and
  branded `BrandButton`/`BrandCard`. **No business logic.**
- **`apps/player-shell`** — the *product*. Depends on `theme-kit` (contract)
  and theme packages (to register them). Owns tenant config, routing, the API
  layer, and pages.

Dependencies only ever point *toward* the contract. A theme never imports the
shell; the shell never imports another theme's internals.

## The shell ↔ theme boundary

Two rules enforce the boundary:

1. **The shell consumes the contract, not the implementation.** Pages render UI
   via `useBrandComponents()` (`const { Button, Card } = ...`). They never
   import `BrandButton` from a tenant package. Swapping the theme swaps the
   component implementations behind the same interface, so appearance changes
   with no feature-code change.

2. **App code never imports raw token files.** `tokens.css` is imported only
   *inside* the theme package (`theme.config.ts` does `import './tokens.css'`).
   The shell pulls the theme in through its package entry point, so tokens
   arrive as a side effect of registering the theme.

Tokens are applied by scope: each theme declares a `tokenClass`
(e.g. `.theme-tenant-alpha`) that defines the `--brand-*` custom properties.
`ThemeProvider` renders a wrapper carrying that class + `data-theme`, so every
component below reads the right tokens via `var(--brand-*)`.

Styling uses **Tailwind v4**, but it doesn't break this boundary: `global.css`
maps Tailwind's theme onto the brand tokens with `@theme inline`
(`--color-brand-primary: var(--brand-color-primary)`, etc.), so a utility like
`bg-brand-primary` compiles to `var(--brand-color-primary)` and still resolves
through the active `.theme-*` scope. Tailwind hard-codes no brand value, and
`@source` entries let it scan the theme packages for the classes they use.

## How a tenant resolves to a theme

```
TenantProvider (brandId, locale, currency)
   └─ ThemedApp: resolveTheme(brandId)  ──► BrandTheme | undefined
        └─ ThemeProvider theme={...}     (undefined ⇒ fallback theme)
             └─ AppLayout + routed pages
```

`theme/themeRegistry.ts` is the single wiring point: `brandId → theme`. An
unknown brand returns `undefined`, and `ThemeProvider` falls back to the default
theme automatically — so the shell always renders, themed or not.

## The API layer (replaceable adapters)

`api/types.ts` defines `IdentityApi`, `BillingApi`, and the combined
`ApiClient`. Pages get them through `useApi()`, and the concrete implementation
is injected at `ApiProvider`. `mockApi.ts` is the dev/test implementation;
replacing it with a real HTTP client is a one-line change at the provider and
requires no page edits. The login test demonstrates this by injecting a custom
adapter.

Demo triggers and latencies are isolated in `api/mock.constants.ts`
(`DEMO_FAILING_EMAIL`, `DEMO_ERROR_TENANT_ID`, `MOCK_LATENCY_MS`), and brand ids
in `config/brands.ts`.

## Folder conventions

```
src/
  api/         types, mock client, ApiProvider + api.context (hook), constants
  components/  shared + page-specific UI (AppLayout, billing/*)
  config/      brand ids
  lib/         framework-agnostic helpers (validation)
  pages/       route components (Home, Login, Billing)
  session/     SessionProvider + session.context (hook)
  tenant/      TenantProvider + tenant.context (hook + tenants)
  theme/       brandId → theme registry
```

- **One component per file.** Page-specific pieces (`InvoicesCard`,
  `InvoiceList`, `PaymentForm`) live under `components/billing/`, not under
  `pages/`, matching where `AppLayout` lives.
- **Context split.** Each context ships as two files: a `*.context.ts` (the
  `createContext` object + hook + constants) and a `*Provider.tsx` (the provider
  component only). This keeps every `.tsx` exporting *only* components, which is
  required for React Fast Refresh and keeps lint clean.

## Billing data loading

`InvoicesCard` owns the fetch. It is mounted with `key={tenant.brandId}`, so
switching tenant remounts it and naturally resets to the loading state. The
effect sets state only inside the async `.then/.catch` (never synchronously),
and retry bumps an attempt counter — so the loading/error/empty flow needs no
lint suppressions.

## State / context map

| Context           | Responsibility                                  |
| ----------------- | ----------------------------------------------- |
| `TenantProvider`  | brandId, locale, currency (+ runtime switch)    |
| `SessionProvider` | the signed-in user                              |
| `ApiProvider`     | injectable `ApiClient` (data layer seam)        |
| `ThemeProvider`   | active `BrandTheme` + token scope (theme-kit)   |

## Scaling to more brands

1. Create `themes/theme-tenant-<x>` depending on `@mts/theme-kit`.
2. Implement `tokens.css` and the required components; export a `BrandTheme`.
3. Add one line to `themeRegistry.ts` (and a tenant entry in `tenant.context.ts`).

No shell feature code changes. The contract guarantees every brand exposes the
same component surface, so pages keep working.
