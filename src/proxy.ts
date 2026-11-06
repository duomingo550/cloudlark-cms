import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const uploadRoutes = [
  { prefix: '/api/media', limit: 10 * 1024 * 1024 },
  { prefix: '/api/audio-assets', limit: 50 * 1024 * 1024 },
  { prefix: '/api/download-assets', limit: 200 * 1024 * 1024 },
]

export function proxy(request: NextRequest) {
  if (!['POST', 'PATCH', 'PUT'].includes(request.method)) {
    return NextResponse.next()
  }

  const route = uploadRoutes.find(({ prefix }) =>
    request.nextUrl.pathname.startsWith(prefix),
  )
  if (!route) return NextResponse.next()

  const length = Number(request.headers.get('content-length') || 0)
  // Multipart metadata adds a small amount over the actual file payload.
  if (Number.isFinite(length) && length > route.limit + 256 * 1024) {
    return NextResponse.json(
      { errors: [{ message: '上传请求超过该集合允许的大小上限' }] },
      { status: 413 },
    )
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/media/:path*', '/api/audio-assets/:path*', '/api/download-assets/:path*'],
}
