export function safeHref(value?: string | null) {
  if (!value) return null
  const raw = value.trim()
  if (!raw) return null
  if (/^\/(?!\/)/.test(raw)) return raw
  if (/^mailto:[^\s]+$/i.test(raw)) return raw
  if (/^https?:\/\//i.test(raw)) return raw
  return null
}

export function safeExternalUrl(value?: string | null) {
  const href = safeHref(value)
  return href && /^https?:\/\//i.test(href) ? href : null
}
