/**
 * AI 能力（阶段一：只预留接口，不接真实模型、不发起任何网络请求）。
 */
export type AiErrorCode = 'AI_NOT_CONFIGURED' | 'AI_NOT_IMPLEMENTED'

export interface AiResult<T> {
  ok: boolean
  code?: AiErrorCode
  message?: string
  data?: T
}

export interface AiDraftRequest {
  task: 'summary' | 'title' | 'tags'
  input: string
}
