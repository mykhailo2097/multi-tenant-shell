# Multi-Tenant Player Shell

A minimal **white-label frontend architecture**: one functional shell app plus a
swappable brand theme package. The same feature code is re-skinned per tenant
with zero changes — only the theme package changes.

## Layout (monorepo, npm workspaces)

```
apps/player-shell/          React + Vite + TS shell (pages, tenant, API adapters)
packages/theme-kit/         Theme CONTRACT: BrandTheme type, ThemeProvider, fallback theme
themes/theme-tenant-alpha/  Branded tokens.css + BrandButton/BrandCard (no business logic)
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the shell ↔ theme boundary and
[DECISIONS.md](./DECISIONS.md) for the trade-offs.

## Requirements

- **Node ≥ 20** (see `.nvmrc` → `nvm use`). The toolchain (ESLint 10, Vite 8)
  requires Node 20+; older versions fail to start ESLint.
- npm 9+ (workspaces).

## Install & run

```bash
nvm use          # optional, picks Node 24 from .nvmrc
npm install      # installs all workspaces
npm run dev      # start the shell (Vite prints the URL, usually http://localhost:5173)
```

## Scripts (run from the repo root)

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the shell in dev mode (HMR). |
| `npm run build` | Type-check + production build of the shell. |
| `npm run test` | Unit tests (Vitest + Testing Library). |
| `npm run typecheck` | `tsc --noEmit` across the shell. |
| `npm run lint` | ESLint across all workspaces. |
| `npm run lint:fix` | ESLint with `--fix` (also collapses stray blank lines). |
| `npm run storybook -w apps/player-shell` | Run Storybook at http://localhost:6006. |
| `npm run build-storybook -w apps/player-shell` | Build a static Storybook. |

## Storybook

Storybook (v10, with the **a11y addon**) documents the branded UI components in
isolation:

```bash
npm run storybook -w apps/player-shell        # dev server on :6006
npm run build-storybook -w apps/player-shell  # static build → storybook-static/
```

Stories are co-located with the components in
`themes/theme-tenant-alpha/src/components/` and cover `BrandButton` and
`BrandCard`. Each story applies the theme's token class via a decorator, so
components render with the real brand tokens. The a11y addon runs axe checks on
every story.

## Testing

Tests run with **Vitest 4 + Testing Library + jsdom**:

```bash
npm run test                          # run all tests once (from repo root)
npm run test:watch -w apps/player-shell   # watch mode while developing
```

Current coverage (17 tests across 3 files):

- `lib/validation.test.ts` — email / password / amount validation + `formatMoney`.
- `pages/LoginPage.test.tsx` — form validation, the injected API adapter, and the
  auth-error path.
- `components/billing/InvoicesCard.test.tsx` — the billing **loading → ready**,
  **empty**, and **error → retry** states, driven by an injected `BillingApi`.

Tests assert behavior (text, roles, adapter calls), not styling, so they're
unaffected by the Tailwind migration.

## Try the acceptance criteria

- **Routing** — `/`, `/auth/login`, `/account/billing` (header nav).
- **Theme switch with no feature change** — use the **Brand** dropdown in the
  header. `Tenant Alpha` loads `theme-tenant-alpha`; `Default Tenant` has no
  registered theme and renders with the fallback theme. Same pages either way.
- **Loading / error / empty states** — the billing page shows a loading state,
  then invoices. The empty state (no invoices) and the error + retry flow (mock
  throws for a `tenant-error` id) are exercised in `InvoicesCard.test.tsx`.
- **Form validation** — login validates email/password; billing validates the
  payment amount (positive, ≤ 10,000, ≤ 2 decimals). Limits live in
  `lib/validation.ts`; demo triggers in `api/mock.constants.ts`.
- **Swappable API adapters** — pages depend on the `ApiClient` interface via
  `useApi()`; `api/mockApi.ts` is injected at `ApiProvider`. The login test
  injects a hand-written adapter with no page changes.

## Styling (Tailwind CSS v4)

Styling is **Tailwind v4**, wired so it never breaks theming:

- `global.css` imports Tailwind and maps its theme onto the brand tokens with
  `@theme inline` (e.g. `--color-brand-primary: var(--brand-color-primary)`).
  So `bg-brand-primary`, `rounded-brand`, `shadow-brand`, `text-brand-text-muted`,
  etc. resolve to the **active tenant's** tokens — switching brand still
  re-skins everything, because the tokens are scoped by the `.theme-*` class.
- The theme packages live outside the app, so `global.css` declares `@source`
  for `packages/theme-kit/src` and `themes/theme-tenant-alpha/src` to generate
  the utility classes they use.
- Base element styling (body, focus rings, inputs, labels) is in an
  `@layer base` block reading the same tokens.

The Vite plugin (`@tailwindcss/vite`) is registered in `vite.config.ts`, so the
dev server, production build, and Storybook all get Tailwind.

## Tooling

- **Vite 8 / React 19 / TypeScript 6 / Vitest 4 / ESLint 10 / Storybook 10 /
  Tailwind 4** — current latest majors, mutually compatible.
- **ESLint** uses a flat config (`eslint.config.js`) covering every workspace,
  with `@stylistic` rules so `--fix` removes extra blank lines / trailing
  whitespace.

## Nice-to-haves included

- Storybook for the two branded components, plus the a11y (axe) addon.
- A unit test for the login container (`LoginPage.test.tsx`), including proof the
  API adapter is injectable.
- Accessibility basics: labelled inputs, `aria-invalid`/`aria-describedby`,
  `role="alert"`/`role="status"` live regions, and visible focus styles.
