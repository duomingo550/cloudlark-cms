const base = (process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000').replace(
  /\/+$/,
  '',
)
const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
const password = process.env.SEED_ADMIN_PASSWORD || 'change-this-password'

const failures = []

async function expectStatus(pathname, status, options) {
  const response = await fetch(base + pathname, {
    redirect: 'follow',
    ...options,
  })
  if (response.status !== status) {
    failures.push(`${pathname}: expected ${status}, got ${response.status}`)
  }
  return response
}

const publicPages = [
  '/',
  '/tools',
  '/tools/doubao-com-chat',
  '/news',
  '/news/ai-agents-at-work',
  '/tutorials',
  '/tutorials/tutorial-1',
  '/agents',
  '/store',
  '/skills',
  '/learning',
  '/learning/path-1',
  '/about',
  '/search?q=视频',
  '/admin/login',
]

for (const pathname of publicPages) {
  await expectStatus(pathname, 200)
}

await expectStatus('/api/sites', 403)
await expectStatus('/api/articles?limit=1', 403)

const loginResponse = await fetch(base + '/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
const login = await loginResponse.json()
if (!login.token) {
  failures.push('admin login failed: ' + JSON.stringify(login.errors || login))
} else {
  const headers = { Authorization: `Bearer ${login.token}` }
  const sitesResponse = await fetch(base + '/api/sites?limit=2', { headers })
  if (!sitesResponse.ok) {
    failures.push(`authenticated sites request failed: ${sitesResponse.status}`)
  }
  const sites = await sitesResponse.json()
  if (!sites.docs?.some((site) => site.slug === 'cloud-lark-demo')) {
    failures.push('seed site cloud-lark-demo not found')
  }

  const sectionsResponse = await fetch(
    base + '/api/sections?limit=100&depth=0&sort=position',
    { headers },
  )
  const sections = await sectionsResponse.json()
  const keys = new Set((sections.docs || []).map((section) => section.key))
  for (const key of [
    'tools',
    'news',
    'courses',
    'learning',
    'agents',
    'skills',
    'store',
  ]) {
    if (!keys.has(key)) failures.push(`missing section: ${key}`)
  }
}

if (failures.length) {
  console.error('Smoke test failed:')
  for (const failure of failures) console.error('  - ' + failure)
  process.exitCode = 1
} else {
  console.log(`Smoke test passed: ${publicPages.length} pages + authenticated API`)
}
