// The only place that reads import.meta.env. Jest can't parse
// import.meta, so tests resolve this module to src/test/envMock.js instead
// (see moduleNameMapper in jest.config.cjs).
export const isDev = Boolean(import.meta.env.DEV)
export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
// Sample menu data is only acceptable for local/demo use, never in production.
export const allowPlaceholderData = isDev || isDemoMode

// Supabase connection settings. The placeholder values let the app boot (and
// CI build) without a project configured; every request then simply fails.
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
export const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key'

// Public URL of the deployed web app. Needed where window.location.origin is
// wrong, e.g. inside the Capacitor Android app (origin is localhost), so that
// emailed links (password reset) open the real site. Empty = use the current origin.
export const appUrl = (import.meta.env.VITE_APP_URL || '').replace(/\/+$/, '')
