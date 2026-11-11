import type { Metadata } from 'next'

import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: '联系我',
}

export default function ContactPage() {
  return (
    <>
      <section className="hero">
        <span className="kicker">联系我</span>
        <h1>
          有想法，<em>聊聊看</em>
        </h1>
        <p>
          留下你的称呼、邮箱和想聊的内容，我会尽快回复。无论是工具推荐、合作，还是内容建议，都欢迎。
        </p>
      </section>

      <section className="sec contact-sec">
        <div className="sec-head">
          <h2>给我留言</h2>
          <span className="tag">通常 1–2 个工作日内回复</span>
        </div>
        <ContactForm />
      </section>
    </>
  )
}
