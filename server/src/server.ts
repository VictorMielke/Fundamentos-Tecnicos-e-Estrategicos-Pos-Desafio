import 'dotenv/config'
import { buildApp } from './app'

async function main() {
  const app = await buildApp()

  const port = Number(process.env.PORT) || 3333
  const host = process.env.HOST || '0.0.0.0'

  try {
    await app.listen({ port, host })
    console.log(`🚀 Servidor rodando em http://${host}:${port}`)
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error)
    process.exit(1)
  }
}

main()
