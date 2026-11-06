import { APIError, type CollectionBeforeChangeHook } from 'payload'

export function uploadSizeLimit(maxBytes: number): CollectionBeforeChangeHook {
  return async ({ data }) => {
    const size = (data as { filesize?: number }).filesize
    if (typeof size === 'number' && size > maxBytes) {
      throw new APIError(
        `文件过大，最大允许 ${Math.round(maxBytes / 1024 / 1024)} MB`,
        413,
      )
    }
    return data
  }
}
