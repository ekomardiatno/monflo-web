# Monflo Web

Personal money flow tracker — React SPA with PWA support.

## Tech Stack

- **React 19** + TypeScript, Vite 8
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **Redux Toolkit** + Redux Persist (local storage)
- **React Router DOM 7** (BrowserRouter with `basename` from `import.meta.env.BASE_URL`)
- **React Hook Form** + Yup validation
- **Recharts** for statistics charts
- **dayjs** for dates, **numeral** for number formatting
- **Google OAuth** via `@react-oauth/google`
- **vite-plugin-pwa** for service worker + manifest

## Project Structure

```
src/
  main.tsx          # Entry — providers: Google OAuth, Redux, PersistGate, BrowserRouter, Toast
  App.tsx           # Routes — GuestRoute (login/register) + ProtectedRoute (app)
  components/       # UI components organized by domain (auth, home, layout, settings, shared, activity, statistics)
  pages/            # Page components (HomePage, ActivityFormPage, StatisticsPage, etc.)
  store/            # Redux store with slices: authSlice, activitySlice, appSlice
  services/         # API layer — api.ts (base), auth/activity/settings services
  hooks/            # Custom hooks
  types/            # TypeScript types
  utils/            # Utility functions
  constants/        # App constants
```

## Commands

- `npm run dev` — dev server (with `--host`)
- `npm run build` — `tsc -b && vite build`
- `npm run lint` — ESLint
- `npm run preview` — preview production build

## Environment Variables

- `VITE_API_URL` — API base URL (default: `http://localhost:4000/api`)
- `VITE_GOOGLE_CLIENT_ID` — Google OAuth client ID
- `VITE_BASE_PATH` — optional base path override (default: `/`)

## Path Alias

`@` → `./src` (configured in vite.config.ts and tsconfig)

## Deployment

- **URL**: https://monflo.ekomardiatno.my.id
- **API**: https://monflo.ekomardiatno.my.id/api (proxied to localhost:5055)
- **Trigger**: GitHub release (publish) → GitHub Actions → build → rsync to VPS
- **VPS path**: `/var/www/monflo`
- **Nginx**: `/etc/nginx/sites-available/monflo` (separate server block with SSL via Certbot)
- **Secrets/vars**: `SSH_KEY`, `SSH_HOST`, `SSH_USER`, `VITE_GOOGLE_CLIENT_ID` (secrets); `VITE_API_URL` (variable)
- **VPS access**: `ssh vps`

## Conventions

- No test framework configured
- Forms use React Hook Form + Yup schemas
- Auth tokens stored in localStorage (`accessToken`)
- Redux slices handle async via createAsyncThunk
- Toast notifications via custom ToastProvider (`components/shared/Toast`)
