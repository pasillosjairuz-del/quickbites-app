// The only place that reads import.meta.env flags. Jest can't parse
// import.meta, so tests resolve this module to src/test/envMock.js instead
// (see moduleNameMapper in jest.config.cjs).
export const isDev = Boolean(import.meta.env.DEV)
export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
// Sample menu data is only acceptable for local/demo use, never in production.
export const allowPlaceholderData = isDev || isDemoMode
