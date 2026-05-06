import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL não está definida nas variáveis de ambiente')
}

const client = postgres(databaseUrl, {
  max: 10, // pool de conexões
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(client, { schema })

export { schema }
