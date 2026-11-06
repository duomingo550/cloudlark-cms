import assert from 'node:assert/strict'
import test from 'node:test'

import { normalizeHost } from '../src/lib/host.ts'
import { safeExternalUrl, safeHref } from '../src/lib/url.ts'

test('normalizes valid hosts and rejects injected values', () => {
  assert.equal(normalizeHost('Example.COM:3000'), 'example.com')
  assert.equal(normalizeHost('example.com.'), 'example.com')
  assert.equal(normalizeHost('example.com@evil.com'), null)
  assert.equal(normalizeHost('evil.com/path'), null)
  assert.equal(normalizeHost(''), null)
})

test('allows only safe link protocols', () => {
  assert.equal(safeHref('https://example.com'), 'https://example.com')
  assert.equal(safeHref('mailto:test@example.com'), 'mailto:test@example.com')
  assert.equal(safeHref('/about'), '/about')
  assert.equal(safeHref('javascript:alert(1)'), null)
  assert.equal(safeHref('data:text/html,alert(1)'), null)
  assert.equal(safeHref('//evil.com'), null)
})

test('external redirects require absolute HTTP(S)', () => {
  assert.equal(safeExternalUrl('https://example.com'), 'https://example.com')
  assert.equal(safeExternalUrl('http://example.com'), 'http://example.com')
  assert.equal(safeExternalUrl('/local'), null)
  assert.equal(safeExternalUrl('javascript:alert(1)'), null)
})
