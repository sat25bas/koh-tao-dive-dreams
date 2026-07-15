function readViteEnvValue(name: string) {
  const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return viteEnv?.[name]?.trim() ?? '';
}

/** Resolve the API origin used by the frontend.
 *
 * The public site should not silently redirect /api requests to the API host
 * unless a specific API base is explicitly configured. This keeps the frontend
 * on the same host for page navigation while allowing explicit split-hosting
 * setups to opt in via VITE_API_BASE_URL/VITE_API_URL.
 */
export function resolveApiBaseUrl() {
  const rawBase = readViteEnvValue('VITE_API_BASE_URL') || readViteEnvValue('VITE_API_URL');
  return rawBase.replace(/\/+$/, '');
}

export function getApiBaseUrl() {
  return resolveApiBaseUrl();
}

export function apiUrl(path: string) {
  const base = resolveApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${normalizedPath}` : normalizedPath;
}
