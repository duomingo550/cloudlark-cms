import type { AiDraftRequest, AiResult } from './types'

/**
 * 阶段一（只预留接口）：
 * - 这里没有任何 fetch / SDK 调用，也不会产生任何网络请求。
 * - 未配置时 complete() 在“任何调用之前”直接返回 AI_NOT_CONFIGURED。
 * - 已配置时也只返回 AI_NOT_IMPLEMENTED，真实调用留给阶段二
 *   （落点：./stubProvider 的同名导出，见该文件注释）。
 */

export const AI_NOT_CONFIGURED_MESSAGE =
  'AI 未配置：请在 .env 里设置 AI_PROVIDER 与 AI_API_KEY 后重启服务。'

export const AI_NOT_IMPLEMENTED_MESSAGE = 'AI 尚未接入（阶段二）'

/** 读取环境变量：只有非空字符串才算“已设置”，避免把空串当成配置。 */
function readEnv(key: string): string | null {
  const value = process.env[key]
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

/**
 * AI 是否已配置：AI_PROVIDER 与 AI_API_KEY 两者都非空。
 * AI_MODEL 只是可选项，不参与判定。
 */
export function aiConfigured(): boolean {
  return aiStatus().configured
}

export function aiStatus(): { configured: boolean; provider: string | null } {
  const provider = readEnv('AI_PROVIDER')
  const apiKey = readEnv('AI_API_KEY')
  return {
    configured: Boolean(provider && apiKey),
    provider,
  }
}

/**
 * 生成摘要 / 标题 / 标签。
 * 阶段一不会触网：未配置返回 AI_NOT_CONFIGURED，已配置返回 AI_NOT_IMPLEMENTED。
 * 注意：本文件（含本函数）不允许出现任何 fetch 调用。
 */
export async function complete(req: AiDraftRequest): Promise<AiResult<string>> {
  // 先判定配置：未配置时连“暂存/请求”的准备工作都不做，直接返回。
  if (!aiConfigured()) {
    return {
      ok: false,
      code: 'AI_NOT_CONFIGURED',
      message: AI_NOT_CONFIGURED_MESSAGE,
    }
  }

  // 阶段二在这里接入真实厂商（届时调用 ./stubProvider 对应实现）。
  // req 在阶段一无副作用消费，保留签名以固定接口形状。
  void req
  return {
    ok: false,
    code: 'AI_NOT_IMPLEMENTED',
    message: AI_NOT_IMPLEMENTED_MESSAGE,
  }
}
