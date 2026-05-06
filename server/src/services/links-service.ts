import { eq, sql } from 'drizzle-orm'
import { db } from '../db'
import { links } from '../db/schema'
import { generateSlug, SLUG_REGEX } from '../utils/random-slug'

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export async function createLink(originalUrl: string, customShortUrl?: string) {
  try {
    new URL(originalUrl)
  } catch {
    throw new ValidationError('URL original inválida')
  }

  let shortUrl: string

  if (customShortUrl) {
    if (!SLUG_REGEX.test(customShortUrl)) {
      throw new ValidationError('URL encurtada mal formatada')
    }

    const existing = await db
      .select()
      .from(links)
      .where(eq(links.shortUrl, customShortUrl))
      .limit(1)

    if (existing.length > 0) {
      throw new ValidationError('URL encurtada já existe')
    }

    shortUrl = customShortUrl
  } else {
    for (let attempt = 0; attempt < 10; attempt++) {
      const candidate = generateSlug()
      const existing = await db
        .select()
        .from(links)
        .where(eq(links.shortUrl, candidate))
        .limit(1)

      if (existing.length === 0) {
        shortUrl = candidate
        break
      }
    }

    if (!shortUrl!) {
      throw new Error('Não foi possível gerar uma URL curta única. Tente novamente.')
    }
  }

  const [link] = await db.insert(links).values({ originalUrl, shortUrl }).returning()

  return link
}

export async function deleteLinkByShortUrl(shortUrl: string) {
  const [deleted] = await db
    .delete(links)
    .where(eq(links.shortUrl, shortUrl))
    .returning()

  if (!deleted) {
    throw new ValidationError('Link não encontrado')
  }

  return deleted
}

export async function getLinkByShortUrl(shortUrl: string) {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortUrl, shortUrl))
    .limit(1)

  return link || null
}

export async function listLinks(limit: number = 100, cursor?: string) {
  const results = cursor
    ? await db
        .select()
        .from(links)
        .where(
          sql`${links.createdAt} < (
            SELECT created_at FROM links WHERE short_url = ${cursor}
          )`
        )
        .orderBy(sql`${links.createdAt} DESC`)
        .limit(limit + 1)
    : await db
        .select()
        .from(links)
        .orderBy(sql`${links.createdAt} DESC`)
        .limit(limit + 1)

  const hasNextPage = results.length > limit
  const data = hasNextPage ? results.slice(0, -1) : results

  return {
    data,
    nextCursor: hasNextPage && data.length > 0 ? data[data.length - 1].shortUrl : null,
    hasNextPage,
  }
}

export async function incrementAccessCount(shortUrl: string) {
  const [updated] = await db
    .update(links)
    .set({ accessCount: sql`${links.accessCount} + 1` })
    .where(eq(links.shortUrl, shortUrl))
    .returning()

  if (!updated) {
    throw new ValidationError('Link não encontrado')
  }

  return updated
}

export async function getAllLinksForExport() {
  return db
    .select()
    .from(links)
    .orderBy(sql`${links.createdAt} DESC`)
}
