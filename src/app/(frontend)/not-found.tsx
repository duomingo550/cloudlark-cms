import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="empty not-found">
      <h1>这一页还没有内容</h1>
      <p>可能还未发布，或者地址已经改变。</p>
      <Link className="btn primary big" href="/">
        返回首页
      </Link>
    </section>
  )
}
