import config from '@payload-config'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { complete } from '@/lib/ai'
import type { AiDraftRequest } from '@/lib/ai/types'

const TASKS: ReadonlyArray<AiDraftRequest['task']> = [
  'summary',
  'title',
  'tags',
]

const isTask = (value: unknown): value is AiDraftRequest['task'] =>
  typeof value === 'string' && (TASKS as ReadonlyArray<string>).includes(value)

/**
 * POST /api/ai/draft
 *
 * 阶段一：只做“已配置/未配置”的判定，不发起任何出站请求。
 * - 匿名：401（复用 Payload 的登录态，不额外造一套鉴权）
 * - 未配置 AI：503 + AI_NOT_CONFIGURED
 * - 已配置但阶段一未实现：501 + AI_NOT_IMPLEMENTED
 */
export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const requestHeaders = new Headers(await headers())
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        code: 'UNAUTHORIZED',
        message: '需要登录后才能使用 AI 生成。',
      },
      { status: 401 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, code: 'BAD_REQUEST', message: '请求体必须是合法的 JSON。' },
      { status: 400 },
    )
  }

  const payloadBody = (body ?? {}) as { input?: unknown; task?: unknown }
  if (!isTask(payloadBody.task)) {
    return NextResponse.json(
      {
        ok: false,
        code: 'BAD_REQUEST',
        message: 'task 必须是 summary、title 或 tags。',
      },
      { status: 400 },
    )
  }

  const input =
    typeof payloadBody.input === 'string' ? payloadBody.input : ''

  const result = await complete({ task: payloadBody.task, input })

  if (result.ok) {
    return NextResponse.json(result)
  }

  const status =
    result.code === 'AI_NOT_CONFIGURED'
      ? 503
      : result.code === 'AI_NOT_IMPLEMENTED'
        ? 501
        : 500

  return NextResponse.json(result, { status })
}
