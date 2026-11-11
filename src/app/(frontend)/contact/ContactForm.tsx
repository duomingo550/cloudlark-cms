'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

type ErrorBody = {
  message?: unknown
  errors?: { message?: unknown; data?: { message?: unknown }[] }[]
}

/**
 * 从 Payload 的错误响应里取出可展示的文案。
 *
 * 兼容三种形状：顶层 message、errors[0].message、以及校验错误的
 * errors[0].data[0].message。取不到时用通用兜底，绝不展示堆栈。
 */
function readErrorMessage(body: unknown): string {
  if (!body || typeof body !== 'object') return '提交失败，请稍后再试'

  const payload = body as ErrorBody
  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message
  }

  const first = payload.errors?.[0]
  if (first && typeof first.message === 'string' && first.message.trim()) {
    return first.message
  }

  const nested = first?.data?.[0]?.message
  if (typeof nested === 'string' && nested.trim()) return nested

  return '提交失败，请稍后再试'
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return

    const form = event.currentTarget
    const data = new FormData(form)

    setStatus('submitting')
    setError('')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') ?? ''),
          email: String(data.get('email') ?? ''),
          message: String(data.get('message') ?? ''),
        }),
      })

      if (response.ok) {
        form.reset()
        setStatus('success')
        return
      }

      let body: unknown = null
      try {
        body = await response.json()
      } catch {
        body = null
      }
      setError(readErrorMessage(body))
      setStatus('error')
    } catch {
      setError('网络异常，请稍后再试')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="contact-success" role="status">
        已收到，我会尽快回复
      </p>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-field">
        <label htmlFor="contact-name">称呼</label>
        <input
          autoComplete="name"
          id="contact-name"
          name="name"
          placeholder="怎么称呼你"
          required
          type="text"
        />
      </div>

      <div className="contact-field">
        <label htmlFor="contact-email">邮箱</label>
        <input
          autoComplete="email"
          id="contact-email"
          name="email"
          placeholder="方便回复的邮箱"
          required
          type="email"
        />
      </div>

      <div className="contact-field">
        <label htmlFor="contact-message">内容</label>
        <textarea
          id="contact-message"
          maxLength={5000}
          name="message"
          placeholder="想聊点什么？"
          required
          rows={7}
        />
      </div>

      {status === 'error' && (
        <p className="contact-error" role="alert">
          {error}
        </p>
      )}

      <button
        className="btn primary big"
        disabled={status === 'submitting'}
        type="submit"
      >
        {status === 'submitting' ? '提交中…' : '发送'}
      </button>
    </form>
  )
}
