'use client'

import { useState } from 'react'

import { AI_NOT_CONFIGURED_MESSAGE } from '@/lib/ai'
import type { AiDraftRequest } from '@/lib/ai/types'

type AiTask = AiDraftRequest['task']

const TASKS: ReadonlyArray<{ label: string; task: AiTask }> = [
  { label: '生成摘要', task: 'summary' },
  { label: '生成标题', task: 'title' },
  { label: '生成标签', task: 'tags' },
]

export interface AiDraftButtonProps {
  /**
   * 是否已配置 AI。由 Articles 集合通过 clientProps 传入 aiConfigured()；
   * 直接按字符串挂载时默认 false（宁可禁用，也不误发请求）。
   */
  configured?: boolean
  /** 生成任务的输入文本；阶段二由调用方/表单提供。 */
  input?: string
}

export default function AiDraftButton({
  configured = false,
  input = '',
}: AiDraftButtonProps) {
  const [pending, setPending] = useState<AiTask | null>(null)
  const [message, setMessage] = useState('')

  const run = async (task: AiTask) => {
    if (!configured || pending) return
    setPending(task)
    setMessage('')

    try {
      // 唯一一次网络请求：仅按钮点击时调用本站 API，绝不直连厂商。
      const body: AiDraftRequest = { task, input }
      const response = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const result = (await response.json().catch(() => null)) as {
        message?: string
      } | null
      setMessage(
        result?.message ||
          (response.ok
            ? '已生成（阶段一未接入真实模型）'
            : `AI 请求失败（HTTP ${response.status}）`),
      )
    } catch {
      setMessage('AI 请求失败，请稍后重试。')
    } finally {
      setPending(null)
    }
  }

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}
    >
      {TASKS.map(({ label, task }) => (
        <button
          className="btn btn--style-secondary btn--size-small"
          disabled={!configured || pending !== null}
          key={task}
          onClick={() => {
            void run(task)
          }}
          title={
            configured ? `${label}（使用已配置的 AI）` : AI_NOT_CONFIGURED_MESSAGE
          }
          type="button"
        >
          {pending === task ? '生成中…' : label}
        </button>
      ))}

      {configured ? null : (
        <span
          style={{
            color: 'var(--theme-elevation-500)',
            fontSize: '12px',
            lineHeight: 1.4,
          }}
        >
          AI 未配置
        </span>
      )}

      {message ? (
        <span
          role="status"
          style={{
            color: 'var(--theme-elevation-600)',
            fontSize: '12px',
            lineHeight: 1.4,
            maxWidth: '24rem',
          }}
        >
          {message}
        </span>
      ) : null}
    </div>
  )
}
