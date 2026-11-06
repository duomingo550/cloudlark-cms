export function normalizeHost(value: string | null) {
  if (!value) return null
  const host = value.split(':')[0].trim().toLowerCase().replace(/\.$/, '')
  if (!host || host.length > 253 || !/^[a-z0-9.-]+$/.test(host)) return null
  return host
}
