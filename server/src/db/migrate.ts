import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config()

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('❌ DATABASE_URL não está definida')
  process.exit(1)
}

const sql = postgres(databaseUrl, { max: 1 })
const db = drizzle(sql)

async function main() {
  console.log('🔄 Executando migrações...')
  
  await migrate(db, {
    migrationsFolder: './drizzle/migrations',
  })
  
  console.log('✅ Migrações executadas com sucesso!')
  
  await sql.end()
  process.exit(0)
}

main().catch((error) => {
  console.error('❌ Erro ao executar migrações:', error)
  process.exit(1)
})
