'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ADMIN_HOME = '/admin'

/**
 * 常驻在左侧导航链接最上方的「仪表板」入口。
 *
 * 通过 admin.components.beforeNavLinks 挂载（Payload 3.93 支持，见
 * node_modules/payload/dist/config/types.d.ts:725），渲染在默认 Nav 分组之前。
 * 需要 'use client'：用 usePathname() 判断当前是否已在仪表板，从而给出
 * aria-current="page" + 高亮；挂点本身不向客户端组件传任何 serverProps。
 */
export default function DashboardLink() {
  const pathname = usePathname()
  const isActive = pathname === ADMIN_HOME || pathname === `${ADMIN_HOME}/`

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={
        isActive
          ? 'nav-dashboard__link nav-dashboard__link--active'
          : 'nav-dashboard__link'
      }
      href={ADMIN_HOME}
    >
      仪表板
    </Link>
  )
}
