import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'

type UserWithRole = {
  id: number | string
  platformRole?: 'admin' | 'user' | null
}

export const isPlatformAdmin = (user: unknown): user is UserWithRole =>
  Boolean(user && (user as UserWithRole).platformRole === 'admin')

export const adminOnly: Access = ({ req }) => isPlatformAdmin(req.user)

export const adminOnlyField: FieldAccess = ({ req }) => isPlatformAdmin(req.user)

export const canAccessAdmin = async ({
  req,
}: {
  req: PayloadRequest
}): Promise<boolean> => {
  if (!req.user) return false
  if (isPlatformAdmin(req.user)) return true
  const membership = await req.payload.count({
    collection: 'memberships',
    overrideAccess: true,
    where: {
      user: { equals: (req.user as UserWithRole).id },
    },
  })
  return membership.totalDocs > 0
}

export async function editableSiteIds(req: {
  payload: any
  user?: unknown
}): Promise<(number | string)[]> {
  if (!req.user) return []
  if (isPlatformAdmin(req.user)) return []

  const result = await req.payload.find({
    collection: 'memberships',
    depth: 0,
    limit: 1000,
    pagination: false,
    overrideAccess: true,
    where: {
      and: [
        { user: { equals: (req.user as UserWithRole).id } },
        { role: { in: ['owner', 'editor'] } },
      ],
    },
  })

  return result.docs
    .map((membership: { site?: number | string | { id: number | string } }) =>
      typeof membership.site === 'object' ? membership.site?.id : membership.site,
    )
    .filter(Boolean) as (number | string)[]
}

export async function memberSiteIds(req: {
  payload: any
  user?: unknown
}): Promise<(number | string)[]> {
  if (!req.user) return []
  if (isPlatformAdmin(req.user)) return []

  const result = await req.payload.find({
    collection: 'memberships',
    depth: 0,
    limit: 1000,
    pagination: false,
    overrideAccess: true,
    where: {
      user: { equals: (req.user as UserWithRole).id },
    },
  })

  return result.docs
    .map((membership: { site?: number | string | { id: number | string } }) =>
      typeof membership.site === 'object' ? membership.site?.id : membership.site,
    )
    .filter(Boolean) as (number | string)[]
}

export const canCreateForSite: Access = async ({ req, data }) => {
  if (isPlatformAdmin(req.user)) return true
  if (!req.user) return false
  const siteIds = await editableSiteIds(req)
  if (!siteIds.length) return false
  const currentSite = data?.site
  if (!currentSite) return false
  const siteId = typeof currentSite === 'object' ? currentSite.id : currentSite
  return siteIds.includes(siteId)
}

export const canManageSiteContent: Access = async ({ req }) => {
  if (isPlatformAdmin(req.user)) return true
  if (!req.user) return false
  const siteIds = await editableSiteIds(req)
  return siteIds.length ? { site: { in: siteIds } } : false
}

export const canReadSite: Access = async ({ req }) => {
  if (!req.user) return false
  if (isPlatformAdmin(req.user)) return true
  const siteIds = await memberSiteIds(req)
  return siteIds.length ? ({ site: { in: siteIds } } as Where) : false
}

export const uploadedFileRead: Access = async (args) => {
  if (args.isReadingStaticFile) return true
  return canReadSite(args)
}

export const memberRead: Access = async ({ req }) => {
  if (!req.user) return false
  if (isPlatformAdmin(req.user)) return true
  const siteIds = await memberSiteIds(req)
  return siteIds.length ? ({ id: { in: siteIds } } as Where) : false
}

export const standardContentAccess = {
  create: canCreateForSite,
  read: canReadSite,
  update: canManageSiteContent,
  delete: canManageSiteContent,
}
