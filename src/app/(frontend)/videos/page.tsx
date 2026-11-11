import type { Metadata } from 'next'

import { EntryCard } from '@/components/site/EntryCard'
import { getCollectionEntries } from '@/lib/content'
import { getCurrentSite } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite()
  if (!site) return {}
  return pageMetadata({
    site,
    fallbackTitle: '视频作品',
    path: '/videos',
  })
}

export default async function VideosPage() {
  const site = await getCurrentSite()
  if (!site) return null
  const videos = await getCollectionEntries('videos', site.id, { limit: 200 })

  return (
    <section className="sec">
      <div className="sec-head">
        <h1>视频作品</h1>
        <span className="tag">{videos.length} 条内容</span>
      </div>
      {videos.length === 0 ? (
        <div className="empty">
          视频作品栏目已经就绪，在后台添加并发布内容后会自动显示。
        </div>
      ) : (
        <div className="course-grid">
          {videos.map((video: any) => (
            <EntryCard collection="videos" entry={video} key={video.id} />
          ))}
        </div>
      )}
    </section>
  )
}
