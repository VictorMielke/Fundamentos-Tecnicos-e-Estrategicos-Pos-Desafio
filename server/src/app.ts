import fastify from 'fastify'
import cors from '@fastify/cors'
import { linksRoutes } from './routes/links'

export async function buildApp() {
  const app = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  })

  // CORS
  await app.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // Rotas
  await app.register(linksRoutes)

  // Health check
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  return app
}
