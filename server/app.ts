import fastify from 'fastify'
import cors from '@fastify/cors'

export const app = fastify({
  logger: true,
})

// Habilitar CORS
await app.register(cors, {
  origin: true, // Em produção, restringir para domínios específicos
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})
