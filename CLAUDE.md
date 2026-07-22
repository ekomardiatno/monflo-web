# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monflo React is the web version of the Monflo financial management app, built with React 19, TypeScript, Vite, and Tailwind CSS. It shares the same backend API and feature set as the React Native mobile app (`monflo`).

## Common Commands

```bash
npm run dev          # Start Vite dev server (with --host)
npm run build        # Type-check (tsc) then Vite build
npm run lint         # ESLint
npm run preview      # Preview production build
```

No test framework is configured yet.

## Architecture

### State Management
Redux Toolkit with three slices, persisted via Redux Persist (localStorage):
- `auth` — user authentication, profile, JWT tokens
- `activity` — financial transactions/activities
- `app` — app settings (theme mode, amount visibility)

Async thunks handle all API calls. Token refresh is automatic on 401 responses (see `src/services/api.ts`).

### Routing
React Router DOM v7. `App.tsx` defines routes wrapped with `ProtectedRoute` and `GuestRoute` components. Protected pages use an `AppShell` layout.

### Source Layout (`src/`)
- `store/slices/` — Redux slices with async thunks
- `store/hooks.ts` — `useAppDispatch`, `useAppSelector`
- `services/` — API layer (`api.ts` is the base fetch wrapper; other services wrap specific endpoints)
- `pages/` — Page components
- `components/` — Organized by domain (`activity/`, `auth/`, `home/`, `layout/`, `settings/`, `shared/`, `statistics/`)
- `hooks/` — Custom React hooks
- `types/` — TypeScript type definitions
- `constants/` — App constants
- `utils/` — Utility functions

### API
Base URL configured via Vite env (`VITE_API_URL`, defaults to `http://localhost:4000/api`). All requests go through `src/services/api.ts` which handles bearer token auth and automatic token refresh.

### Auth Flow
Supports email/password and Google OAuth (`@react-oauth/google`). JWT-based with access/refresh tokens stored in Redux (persisted).

## Key Conventions

- Path alias: `@/*` maps to `src/*`
- Date parsing uses `dayjs`
- Number formatting uses `numeral`
- Forms use `react-hook-form` with `yup` validation
- Charts use `recharts`
- Theme support: light/dark modes via `app` slice

## Related Projects

Monflo is a multi-platform system with a shared backend. All repos have their own CLAUDE.md — review them when making cross-repo changes.

- **`monflo-api`** — Backend REST API (Express 5 + Prisma + PostgreSQL). Both frontends consume the same API endpoints. API changes must stay compatible with both clients.
- **`monflo`** — React Native mobile app. Mirrors the same features and Redux structure as this web app.
