import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const links = pgTable('links', {
  id: uuid('id').defaultRandom().primaryKey(),
  originalUrl: text('original_url').notNull(),
  shortUrl: text('short_url').notNull().unique(),
  accessCount: integer('access_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
