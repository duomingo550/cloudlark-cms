import type { AiDraftRequest, AiResult } from './types'

/**
 * 阶段二的落点：真实厂商实现应放在这个文件里，并由 index.complete() 调用。
 * 阶段一故意不在 index.complete() 里引用它——这里只有固定文案的桩，不发起任何请求。
 */

const STUB_TEXT: Record<AiDraftRequest['task'], string> = {
  summary: '（AI 桩）这里是一段固定的摘要示例文本。',
  title: '（AI 桩）固定的标题示例',
  tags: '（AI 桩）示例标签, 预留接口',
}

export const STUB_PROVIDER = 'stub'

export async function stubComplete(
  req: AiDraftRequest,
): Promise<AiResult<string>> {
  return {
    ok: true,
    data: STUB_TEXT[req.task] ?? STUB_TEXT.summary,
  }
}
